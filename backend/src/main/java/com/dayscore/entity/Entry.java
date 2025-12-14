package com.dayscore.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entry {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private LocalDate date;

  @Column(nullable = false)
  private Integer score;

  @Column(length = 1000)
  private String note;

  public Entry(LocalDate date, Integer score, String note) {
    this.date = date;
    this.score = score;
    this.note = note;
  }
}
