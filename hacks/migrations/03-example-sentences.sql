--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE EXAMPLE_SENTENCES (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT,
  audio_japanese TEXT,
  japanese TEXT NOT NULL,
  english TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE EXAMPLE_SENTENCES;
