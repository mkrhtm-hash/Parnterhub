-- Partnerhub database schema. Safe to run repeatedly.

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

CREATE TABLE IF NOT EXISTS broker_licences (
  broker_id      text NOT NULL REFERENCES brokers (id) ON DELETE CASCADE,
  regulator_code text NOT NULL REFERENCES regulators (code),
  licence_number text NOT NULL,
  sort_order     integer NOT NULL DEFAULT 0,
  PRIMARY KEY (broker_id, regulator_code)
);
CREATE INDEX IF NOT EXISTS broker_licences_regulator_idx ON broker_licences (regulator_code);

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
CREATE INDEX IF NOT EXISTS consultations_created_at_idx ON consultations (created_at DESC);
CREATE INDEX IF NOT EXISTS consultations_email_idx ON consultations (email);
CREATE INDEX IF NOT EXISTS consultations_preferred_date_idx ON consultations (preferred_date);
