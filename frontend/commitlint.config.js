module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature (minor)
        "fix", // Bug fix (patch)
        "docs", // Documentation changes (patch)
        "refactor", // Code improvement (patch)
        "test", // Test changes (patch)
        "build", // Build/CI changes (patch)
        "chore", // Maintenance (patch)
        "revert", // Reverts (patch)
      ],
    ],
    "subject-case": [0], // Allow any case in subject
    "subject-full-stop": [0], // Allow trailing period
  },
};
