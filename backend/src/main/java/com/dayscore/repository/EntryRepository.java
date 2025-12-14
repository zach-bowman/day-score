package com.dayscore.repository;

import com.dayscore.entity.Entry;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntryRepository extends JpaRepository<Entry, Long> {

  Optional<Entry> findByDate(LocalDate date);

  boolean existsByDate(LocalDate date);
}
