-- Друзья, рейтинг и лента активности

ALTER TABLE users
  ADD COLUMN nickname text CHECK (nickname ~ '^[A-Za-z0-9_]{3,20}$'),
  ADD COLUMN avatar text,
  ADD COLUMN friend_code text,
  ADD COLUMN hide_from_rating boolean NOT NULL DEFAULT false,
  ADD COLUMN hide_activity boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX users_nickname_idx ON users (lower(nickname));
CREATE UNIQUE INDEX users_friend_code_idx ON users (friend_code);

CREATE TABLE friend_requests (
  from_user bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  to_user bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (from_user, to_user),
  CHECK (from_user <> to_user)
);
CREATE INDEX friend_requests_to_user_idx ON friend_requests (to_user);

-- пара хранится один раз: меньший id в user_a
CREATE TABLE friendships (
  user_a bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  user_b bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_a, user_b),
  CHECK (user_a < user_b)
);
CREATE INDEX friendships_user_b_idx ON friendships (user_b);

-- Сводка, пересчитанная сервером из прогресса по каталогу курсов
CREATE TABLE user_stats (
  user_id bigint PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  xp_total integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  courses jsonb NOT NULL DEFAULT '{}',
  achievements jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Каждый пройденный элемент фиксируется один раз с серверным временем — отсюда недельный рейтинг и лента.
-- live = false: элемент пришёл при первой синхронизации (гостевой прогресс) — идёт только в общий зачёт.
-- counted = false: превышен дневной лимит XP — в недельный рейтинг не идёт.
CREATE TABLE progress_events (
  user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
  item text NOT NULL,
  kind text NOT NULL,
  course text,
  ref text,
  xp integer NOT NULL DEFAULT 0,
  data jsonb,
  live boolean NOT NULL,
  counted boolean NOT NULL,
  at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item)
);
CREATE INDEX progress_events_user_at_idx ON progress_events (user_id, at);
