-- MKPips database schema. Safe to run repeatedly.

CREATE TABLE IF NOT EXISTS regulator_tiers (
  id      integer PRIMARY KEY,
  name    text NOT NULL,
  label   text NOT NULL,
  summary text NOT NULL
);

CREATE TABLE IF NOT EXISTS regulators (
  code             text PRIMARY KEY,
  name             text NOT NULL,
  jurisdiction     text NOT NULL,
  tier             integer NOT NULL REFERENCES regulator_tiers (id),
  register_url     text NOT NULL,
  segregation      text NOT NULL,
  negative_balance text NOT NULL,
  compensation     text NOT NULL
);
CREATE INDEX IF NOT EXISTS regulators_tier_idx ON regulators (tier);

CREATE TABLE IF NOT EXISTS countries (
  code           text PRIMARY KEY,
  name           text NOT NULL,
  home_regulator text REFERENCES regulators (code),
  sort_order     integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brokers (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  is_sample    boolean NOT NULL DEFAULT true,
  min_deposit  integer NOT NULL CHECK (min_deposit >= 0),
  spreads      text NOT NULL,
  commission   text NOT NULL,
  support      text NOT NULL,
  verify_url   text,
  platforms    text[] NOT NULL DEFAULT '{}',
  instruments  text[] NOT NULL DEFAULT '{}',
  available_in text[] NOT NULL DEFAULT '{}',
  strengths    text[] NOT NULL DEFAULT '{}',
  suited_to    text[] NOT NULL DEFAULT '{}',
  sort_order   integer NOT NULL DEFAULT 0
);

-- Logo files in public/brokers (<logo>-on-dark.svg and <logo>-on-light.svg) and short highlights [{title, note}].
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb;
-- Maximum leverage as the broker states it, e.g. 'Up to 1:500'. Empty hides the line.
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS leverage text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS broker_licences (
  broker_id      text NOT NULL REFERENCES brokers (id) ON DELETE CASCADE,
  regulator_code text NOT NULL REFERENCES regulators (code),
  licence_number text NOT NULL,
  sort_order     integer NOT NULL DEFAULT 0,
  PRIMARY KEY (broker_id, regulator_code)
);
CREATE INDEX IF NOT EXISTS broker_licences_regulator_idx ON broker_licences (regulator_code);
-- The company that holds the licence, its registered address and a direct register link. Optional.
ALTER TABLE broker_licences ADD COLUMN IF NOT EXISTS entity text;
ALTER TABLE broker_licences ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE broker_licences ADD COLUMN IF NOT EXISTS verify_url text;

-- Company details, founder profile, legal text, FAQ and form options. One JSON value per key.
CREATE TABLE IF NOT EXISTS site_content (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Requests from the Book a Consultation form. No API route ever returns these rows.
CREATE TABLE IF NOT EXISTS consultations (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL,
  email          text NOT NULL,
  phone          text NOT NULL,
  country        text NOT NULL,
  experience     text NOT NULL,
  message        text NOT NULL DEFAULT '',
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  consent        boolean NOT NULL CHECK (consent = true),
  status         text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at     timestamptz NOT NULL DEFAULT now()
);
-- Which form the request came from: Book a Consultation, or the Book with Market Expert tab on Learning.
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'consultation'
  CHECK (kind IN ('consultation', 'market-expert'));
-- The price option chosen for a market expert session (see shared/expertSessions.js). Empty for consultations.
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS session_price text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS consultations_created_at_idx ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS consultations_email_idx ON consultations (email);
CREATE INDEX IF NOT EXISTS consultations_preferred_date_idx ON consultations (preferred_date);

-- Videos, ebooks and webinars on the Learning page. A row with no url shows as "Coming soon".
CREATE TABLE IF NOT EXISTS learning_resources (
  id           text PRIMARY KEY,
  kind         text NOT NULL CHECK (kind IN ('video', 'ebook', 'webinar')),
  title        text NOT NULL,
  summary      text NOT NULL,
  topics       text[] NOT NULL DEFAULT '{}',
  level        text NOT NULL DEFAULT 'Beginner',
  length_label text,
  url          text CHECK (url IS NULL OR url ~ '^(https://|/)'),
  sort_order   integer NOT NULL DEFAULT 0,
  published    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS learning_resources_order_idx ON learning_resources (published, sort_order);

-- Webinars share the learning table. These keep databases set up before webinars existed in step.
ALTER TABLE learning_resources ADD COLUMN IF NOT EXISTS starts_at timestamptz;
ALTER TABLE learning_resources DROP CONSTRAINT IF EXISTS learning_resources_kind_check;
ALTER TABLE learning_resources ADD CONSTRAINT learning_resources_kind_check CHECK (kind IN ('video', 'ebook', 'webinar'));

-- Messages from the Your Opinion tab. Private: no API route ever returns these rows.
CREATE TABLE IF NOT EXISTS learning_feedback (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL DEFAULT '',
  topic      text NOT NULL CHECK (topic IN ('video', 'ebook', 'webinar', 'general')),
  rating     integer CHECK (rating BETWEEN 1 AND 5),
  message    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS learning_feedback_created_at_idx ON learning_feedback (created_at DESC);
