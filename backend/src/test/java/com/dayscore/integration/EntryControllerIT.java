package com.dayscore.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dayscore.entity.Entry;
import com.dayscore.repository.EntryRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class EntryControllerIT {

  @Autowired private MockMvc mockMvc;

  @Autowired private EntryRepository entryRepository;

  @BeforeEach
  void setUp() {
    entryRepository.deleteAll();
  }

  @Test
  void it_getAllEntries_returnsEmptyListInitially() throws Exception {
    mockMvc
        .perform(get("/api/entries"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(0));
  }

  @Test
  void it_createEntry_validRequest_returns201WithEntry() throws Exception {
    String requestBody =
        """
        {
          "date": "2024-01-15",
          "score": 4,
          "note": "Great day!"
        }
        """;

    mockMvc
        .perform(post("/api/entries").contentType(MediaType.APPLICATION_JSON).content(requestBody))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.date").value("2024-01-15"))
        .andExpect(jsonPath("$.score").value(4))
        .andExpect(jsonPath("$.note").value("Great day!"));
  }

  @Test
  void it_createEntry_invalidScore_returns400() throws Exception {
    String requestBody =
        """
        {
          "date": "2024-01-15",
          "score": 10,
          "note": null
        }
        """;

    mockMvc
        .perform(post("/api/entries").contentType(MediaType.APPLICATION_JSON).content(requestBody))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Score must be between 1 and 5"));
  }

  @Test
  void it_createEntry_duplicateDate_returns400() throws Exception {
    entryRepository.save(new Entry(LocalDate.of(2024, 1, 15), 3, null));

    String requestBody =
        """
        {
          "date": "2024-01-15",
          "score": 4,
          "note": null
        }
        """;

    mockMvc
        .perform(post("/api/entries").contentType(MediaType.APPLICATION_JSON).content(requestBody))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Entry already exists for date: 2024-01-15"));
  }

  @Test
  void it_getEntryById_existingEntry_returns200() throws Exception {
    Entry saved = entryRepository.save(new Entry(LocalDate.of(2024, 1, 15), 3, "Test note"));

    mockMvc
        .perform(get("/api/entries/" + saved.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(saved.getId()))
        .andExpect(jsonPath("$.date").value("2024-01-15"))
        .andExpect(jsonPath("$.score").value(3))
        .andExpect(jsonPath("$.note").value("Test note"));
  }

  @Test
  void it_getEntryById_nonExistingEntry_returns404() throws Exception {
    mockMvc.perform(get("/api/entries/999")).andExpect(status().isNotFound());
  }

  @Test
  void it_updateEntry_validRequest_returns200() throws Exception {
    Entry saved = entryRepository.save(new Entry(LocalDate.of(2024, 1, 15), 3, "Old note"));

    String requestBody =
        """
        {
          "score": 5,
          "note": "Updated note"
        }
        """;

    mockMvc
        .perform(
            put("/api/entries/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(saved.getId()))
        .andExpect(jsonPath("$.date").value("2024-01-15"))
        .andExpect(jsonPath("$.score").value(5))
        .andExpect(jsonPath("$.note").value("Updated note"));
  }

  @Test
  void it_updateEntry_nonExistingEntry_returns400() throws Exception {
    String requestBody =
        """
        {
          "score": 5,
          "note": null
        }
        """;

    mockMvc
        .perform(
            put("/api/entries/999").contentType(MediaType.APPLICATION_JSON).content(requestBody))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Entry not found with id: 999"));
  }

  @Test
  void it_deleteEntry_existingEntry_returns204() throws Exception {
    Entry saved = entryRepository.save(new Entry(LocalDate.of(2024, 1, 15), 3, null));

    mockMvc.perform(delete("/api/entries/" + saved.getId())).andExpect(status().isNoContent());
  }

  @Test
  void it_deleteEntry_nonExistingEntry_returns400() throws Exception {
    mockMvc
        .perform(delete("/api/entries/999"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Entry not found with id: 999"));
  }
}
