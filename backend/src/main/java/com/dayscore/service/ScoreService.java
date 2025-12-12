package com.dayscore.service;

import org.springframework.stereotype.Service;

@Service
public class ScoreService {

  public boolean isValidScore(int score) {
    return score >= 1 && score <= 5;
  }
}
