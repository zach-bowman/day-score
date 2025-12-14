package com.dayscore.service;

import com.dayscore.entity.Entry;
import com.dayscore.repository.EntryRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class EntryService {

  private final EntryRepository entryRepository;
  private final ScoreService scoreService;

  public EntryService(EntryRepository entryRepository, ScoreService scoreService) {
    this.entryRepository = entryRepository;
    this.scoreService = scoreService;
  }

  public List<Entry> getAllEntries() {
    return entryRepository.findAll();
  }

  public Optional<Entry> getEntryById(Long id) {
    return entryRepository.findById(id);
  }

  public Optional<Entry> getEntryByDate(LocalDate date) {
    return entryRepository.findByDate(date);
  }

  public Entry createEntry(LocalDate date, Integer score, String note) {
    if (!scoreService.isValidScore(score)) {
      throw new IllegalArgumentException("Score must be between 1 and 5");
    }
    if (entryRepository.existsByDate(date)) {
      throw new IllegalArgumentException("Entry already exists for date: " + date);
    }
    Entry entry = new Entry(date, score, note);
    return entryRepository.save(entry);
  }

  public Entry updateEntry(Long id, Integer score, String note) {
    Entry entry =
        entryRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Entry not found with id: " + id));

    if (!scoreService.isValidScore(score)) {
      throw new IllegalArgumentException("Score must be between 1 and 5");
    }

    entry.setScore(score);
    entry.setNote(note);
    return entryRepository.save(entry);
  }

  public void deleteEntry(Long id) {
    if (!entryRepository.existsById(id)) {
      throw new IllegalArgumentException("Entry not found with id: " + id);
    }
    entryRepository.deleteById(id);
  }
}
