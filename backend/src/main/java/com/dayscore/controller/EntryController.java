package com.dayscore.controller;

import com.dayscore.entity.Entry;
import com.dayscore.service.EntryService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entries")
public class EntryController {

  private final EntryService entryService;

  public EntryController(EntryService entryService) {
    this.entryService = entryService;
  }

  @GetMapping
  public List<Entry> getAllEntries() {
    return entryService.getAllEntries();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Entry> getEntryById(@PathVariable Long id) {
    return entryService
        .getEntryById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Entry> createEntry(@RequestBody CreateEntryRequest request) {
    Entry entry = entryService.createEntry(request.date(), request.score(), request.note());
    return ResponseEntity.status(HttpStatus.CREATED).body(entry);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Entry> updateEntry(
      @PathVariable Long id, @RequestBody UpdateEntryRequest request) {
    Entry entry = entryService.updateEntry(id, request.score(), request.note());
    return ResponseEntity.ok(entry);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
    entryService.deleteEntry(id);
    return ResponseEntity.noContent().build();
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage()));
  }

  public record CreateEntryRequest(LocalDate date, Integer score, String note) {}

  public record UpdateEntryRequest(Integer score, String note) {}

  public record ErrorResponse(String message) {}
}
