USE upizz;
CREATE TABLE chat_messages (
  id INT NOT NULL AUTO_INCREMENT,
  pseudos VARCHAR(255) NOT NULL,
  messages TEXT NOT NULL,
  PRIMARY KEY (id)
);