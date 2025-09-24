CREATE TABLE IF NOT EXISTS chat_history_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    message JSONB NOT NULL
);

alter table chat_history_messages enable row level security;
