
DROP TABLE RequestedRecovery;

CREATE TABLE RequestedRecovery (
  recoveryToken INTEGER PRIMARY KEY NOT NULL,
  email VARCHAR(100) NOT NULL
);