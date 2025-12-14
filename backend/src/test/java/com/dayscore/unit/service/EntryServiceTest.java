package com.dayscore.unit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.dayscore.entity.Entry;
import com.dayscore.repository.EntryRepository;
import com.dayscore.service.EntryService;
import com.dayscore.service.ScoreService;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

  @Mock private EntryRepository entryRepository;

  @Mock private ScoreService scoreService;

  private EntryService entryService;

  @BeforeEach
  void setUp() {
    entryService = new EntryService(entryRepository, scoreService);
  }

  @Test
  void test_getAllEntries_returnsAllEntries() {
    List<Entry> entries =
        List.of(
            new Entry(1L, LocalDate.of(2024, 1, 1), 3, "Good day"),
            new Entry(2L, LocalDate.of(2024, 1, 2), 4, null));
    when(entryRepository.findAll()).thenReturn(entries);

    List<Entry> result = entryService.getAllEntries();

    assertEquals(2, result.size());
    assertEquals(LocalDate.of(2024, 1, 1), result.get(0).getDate());
    assertEquals(LocalDate.of(2024, 1, 2), result.get(1).getDate());
  }

  @Test
  void test_getAllEntries_emptyList_returnsEmptyList() {
    when(entryRepository.findAll()).thenReturn(List.of());

    List<Entry> result = entryService.getAllEntries();

    assertTrue(result.isEmpty());
  }

  @Test
  void test_getEntryById_existingId_returnsEntry() {
    Entry entry = new Entry(1L, LocalDate.of(2024, 1, 1), 3, "Good day");
    when(entryRepository.findById(1L)).thenReturn(Optional.of(entry));

    Optional<Entry> result = entryService.getEntryById(1L);

    assertTrue(result.isPresent());
    assertEquals(3, result.get().getScore());
  }

  @Test
  void test_getEntryById_nonExistingId_returnsEmpty() {
    when(entryRepository.findById(999L)).thenReturn(Optional.empty());

    Optional<Entry> result = entryService.getEntryById(999L);

    assertTrue(result.isEmpty());
  }

  @Test
  void test_getEntryByDate_existingDate_returnsEntry() {
    LocalDate date = LocalDate.of(2024, 1, 1);
    Entry entry = new Entry(1L, date, 3, "Good day");
    when(entryRepository.findByDate(date)).thenReturn(Optional.of(entry));

    Optional<Entry> result = entryService.getEntryByDate(date);

    assertTrue(result.isPresent());
    assertEquals(date, result.get().getDate());
  }

  @Test
  void test_createEntry_validInput_createsEntry() {
    LocalDate date = LocalDate.of(2024, 1, 1);
    Entry savedEntry = new Entry(1L, date, 3, "Good day");

    when(scoreService.isValidScore(3)).thenReturn(true);
    when(entryRepository.existsByDate(date)).thenReturn(false);
    when(entryRepository.save(any(Entry.class))).thenReturn(savedEntry);

    Entry result = entryService.createEntry(date, 3, "Good day");

    assertEquals(1L, result.getId());
    assertEquals(date, result.getDate());
    assertEquals(3, result.getScore());
    assertEquals("Good day", result.getNote());
  }

  @Test
  void test_createEntry_invalidScore_throwsException() {
    when(scoreService.isValidScore(0)).thenReturn(false);

    IllegalArgumentException exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> entryService.createEntry(LocalDate.of(2024, 1, 1), 0, null));

    assertEquals("Score must be between 1 and 5", exception.getMessage());
    verify(entryRepository, never()).save(any());
  }

  @Test
  void test_createEntry_duplicateDate_throwsException() {
    LocalDate date = LocalDate.of(2024, 1, 1);
    when(scoreService.isValidScore(3)).thenReturn(true);
    when(entryRepository.existsByDate(date)).thenReturn(true);

    IllegalArgumentException exception =
        assertThrows(
            IllegalArgumentException.class, () -> entryService.createEntry(date, 3, "Note"));

    assertEquals("Entry already exists for date: " + date, exception.getMessage());
    verify(entryRepository, never()).save(any());
  }

  @Test
  void test_updateEntry_existingEntry_updatesSuccessfully() {
    Entry existing = new Entry(1L, LocalDate.of(2024, 1, 1), 3, "Old note");
    Entry updated = new Entry(1L, LocalDate.of(2024, 1, 1), 5, "New note");

    when(entryRepository.findById(1L)).thenReturn(Optional.of(existing));
    when(scoreService.isValidScore(5)).thenReturn(true);
    when(entryRepository.save(any(Entry.class))).thenReturn(updated);

    Entry result = entryService.updateEntry(1L, 5, "New note");

    assertEquals(5, result.getScore());
    assertEquals("New note", result.getNote());
  }

  @Test
  void test_updateEntry_nonExistingEntry_throwsException() {
    when(entryRepository.findById(999L)).thenReturn(Optional.empty());

    IllegalArgumentException exception =
        assertThrows(
            IllegalArgumentException.class, () -> entryService.updateEntry(999L, 3, "Note"));

    assertEquals("Entry not found with id: 999", exception.getMessage());
  }

  @Test
  void test_updateEntry_invalidScore_throwsException() {
    Entry existing = new Entry(1L, LocalDate.of(2024, 1, 1), 3, "Note");
    when(entryRepository.findById(1L)).thenReturn(Optional.of(existing));
    when(scoreService.isValidScore(10)).thenReturn(false);

    IllegalArgumentException exception =
        assertThrows(IllegalArgumentException.class, () -> entryService.updateEntry(1L, 10, null));

    assertEquals("Score must be between 1 and 5", exception.getMessage());
    verify(entryRepository, never()).save(any());
  }

  @Test
  void test_deleteEntry_existingEntry_deletesSuccessfully() {
    when(entryRepository.existsById(1L)).thenReturn(true);

    entryService.deleteEntry(1L);

    verify(entryRepository).deleteById(1L);
  }

  @Test
  void test_deleteEntry_nonExistingEntry_throwsException() {
    when(entryRepository.existsById(999L)).thenReturn(false);

    IllegalArgumentException exception =
        assertThrows(IllegalArgumentException.class, () -> entryService.deleteEntry(999L));

    assertEquals("Entry not found with id: 999", exception.getMessage());
    verify(entryRepository, never()).deleteById(any());
  }
}
