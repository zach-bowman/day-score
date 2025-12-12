package com.dayscore.unit.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.dayscore.service.ScoreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ScoreServiceTest {

  private ScoreService scoreService;

  @BeforeEach
  void setUp() {
    scoreService = new ScoreService();
  }

  // isValidScore tests

  @Test
  void test_isValidScore_validScores_returnsTrue() {
    assertTrue(scoreService.isValidScore(1));
    assertTrue(scoreService.isValidScore(2));
    assertTrue(scoreService.isValidScore(3));
    assertTrue(scoreService.isValidScore(4));
    assertTrue(scoreService.isValidScore(5));
  }

  @Test
  void test_isValidScore_scoreBelowMinimum_returnsFalse() {
    assertFalse(scoreService.isValidScore(0));
    assertFalse(scoreService.isValidScore(-1));
    assertFalse(scoreService.isValidScore(-999));
  }

  @Test
  void test_isValidScore_scoreAboveMaximum_returnsFalse() {
    assertFalse(scoreService.isValidScore(6));
    assertFalse(scoreService.isValidScore(10));
    assertFalse(scoreService.isValidScore(999));
  }
}
