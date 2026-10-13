CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash text NOT NULL,
  email_verified_at timestamptz NOT NULL,
  -- когда пользователь дал согласие на обработку персональных данных (152-ФЗ)
  privacy_consent_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- В базе только SHA-256 от токена: утечка таблицы не даёт войти чужими сессиями
CREATE TABLE sessions (
  token_hash bytea PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  ip inet,
  user_agent text
);
CREATE INDEX sessions_user_id_idx ON sessions (user_id);
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);

-- Регистрация создаёт пользователя только после перехода по ссылке из письма;
-- до этого хеш пароля лежит в токене подтверждения
CREATE TABLE email_tokens (
  token_hash bytea PRIMARY KEY,
  purpose text NOT NULL CHECK (purpose IN ('verify', 'reset')),
  email text NOT NULL,
  user_id bigint REFERENCES users ON DELETE CASCADE,
  password_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  CHECK ((purpose = 'verify' AND password_hash IS NOT NULL) OR (purpose = 'reset' AND user_id IS NOT NULL))
);
CREATE INDEX email_tokens_email_idx ON email_tokens (email, created_at);

CREATE TABLE progress (
  user_id bigint PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  data jsonb NOT NULL,
  version integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint REFERENCES users ON DELETE SET NULL,
  type text NOT NULL,
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_events_user_id_idx ON auth_events (user_id, created_at);
CREATE INDEX auth_events_created_at_idx ON auth_events (created_at);
