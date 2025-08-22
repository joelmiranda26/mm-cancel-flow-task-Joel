-- seed.sql
-- Database schema and seed data for subscription cancellation flow
-- Includes schema, integrity checks, A/B helper, and RLS


-- Extensions (needed for gen_random_uuid/bytes)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================
-- Tables
-- =========================


-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INTEGER NOT NULL, -- cents
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_cancellation', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Cancellations
CREATE TABLE IF NOT EXISTS cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A', 'B')),
  reason TEXT,
  accepted_downsell BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========================
-- Schema upgrades / integrity columns
-- =========================


-- Add columns required for flow integrity (idempotent)
ALTER TABLE cancellations
  ADD COLUMN IF NOT EXISTS reason_other TEXT,
  ADD COLUMN IF NOT EXISTS finalized BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS decided_at TIMESTAMP WITH TIME ZONE;


-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_cxl_user ON cancellations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_user ON subscriptions(user_id);


-- Only one OPEN cancellation per subscription at a time
CREATE UNIQUE INDEX IF NOT EXISTS uniq_open_cxl
  ON cancellations(subscription_id)
  WHERE finalized = FALSE;


-- =========================
-- Triggers / functions for data integrity
-- =========================


-- Prevent changing the A/B variant after creation
CREATE OR REPLACE FUNCTION lock_variant() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.downsell_variant <> OLD.downsell_variant THEN
    RAISE EXCEPTION 'downsell_variant cannot be changed';
  END IF;
  RETURN NEW;
END$$;


DROP TRIGGER IF EXISTS trg_lock_variant ON cancellations;
CREATE TRIGGER trg_lock_variant
BEFORE UPDATE ON cancellations
FOR EACH ROW EXECUTE FUNCTION lock_variant();


-- Enforce reason_other presence when reason = 'other'
CREATE OR REPLACE FUNCTION enforce_reason_other() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reason = 'other' AND (NEW.reason_other IS NULL OR length(btrim(NEW.reason_other)) = 0) THEN
    RAISE EXCEPTION 'reason_other required when reason = other';
  END IF;
  RETURN NEW;
END$$;


DROP TRIGGER IF EXISTS trg_reason_other ON cancellations;
CREATE TRIGGER trg_reason_other
BEFORE INSERT OR UPDATE ON cancellations
FOR EACH ROW EXECUTE FUNCTION enforce_reason_other();


-- =========================
-- Service helpers (use via supabaseAdmin.rpc on the server)
-- =========================


-- Create-or-return the open cancellation with a cryptographically random 50/50 variant
CREATE OR REPLACE FUNCTION ensure_cancellation_record(p_subscription UUID, p_user UUID)
RETURNS cancellations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec cancellations;
  bit0 INT;
  variant TEXT;
BEGIN
  -- Ownership check
  PERFORM 1 FROM subscriptions s WHERE s.id = p_subscription AND s.user_id = p_user;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found or not owned by user';
  END IF;


  -- Return existing open record if present
  SELECT * INTO rec
  FROM cancellations
  WHERE subscription_id = p_subscription AND finalized = FALSE
  ORDER BY created_at DESC
  LIMIT 1;


  IF FOUND THEN
    RETURN rec;
  END IF;


  -- Crypto 50/50 A/B assignment
  bit0 := get_bit(gen_random_bytes(1), 0);
  variant := CASE WHEN bit0 = 0 THEN 'A' ELSE 'B' END;


  INSERT INTO cancellations(user_id, subscription_id, downsell_variant)
  VALUES (p_user, p_subscription, variant)
  RETURNING * INTO rec;


  RETURN rec;
END
$$;


-- Controlled subscription state transition to 'pending_cancellation'
CREATE OR REPLACE FUNCTION mark_pending_cancellation(p_subscription UUID, p_user UUID)
RETURNS subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s subscriptions;
BEGIN
  UPDATE subscriptions
     SET status = 'pending_cancellation',
         updated_at = NOW()
   WHERE id = p_subscription
     AND user_id = p_user
     AND status = 'active'
  RETURNING * INTO s;


  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cannot mark pending_cancellation: wrong owner or invalid current status';
  END IF;


  RETURN s;
END
$$;


-- =========================
-- Row Level Security
-- =========================


ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellations ENABLE ROW LEVEL SECURITY;


-- Drop existing policies if they exist to keep idempotent
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own cancellations" ON cancellations;
DROP POLICY IF EXISTS "Users can view own cancellations" ON cancellations;
DROP POLICY IF EXISTS "Users can update own cancellations" ON cancellations;
DROP POLICY IF EXISTS "Users can delete own cancellations" ON cancellations;


-- Users: read own
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);


-- Subscriptions: read/update own
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);


CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- Cancellations: insert/select/update/delete own
CREATE POLICY "Users can insert own cancellations" ON cancellations
  FOR INSERT WITH CHECK (auth.uid() = user_id);


CREATE POLICY "Users can view own cancellations" ON cancellations
  FOR SELECT USING (auth.uid() = user_id);


CREATE POLICY "Users can update own cancellations" ON cancellations
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


CREATE POLICY "Users can delete own cancellations" ON cancellations
  FOR DELETE USING (auth.uid() = user_id);


-- =========================
-- Seed data
-- =========================


INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'user3@example.com')
ON CONFLICT (email) DO NOTHING;


-- $25 / $29 active subscriptions
INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2500, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 2900, 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 2500, 'active')
ON CONFLICT DO NOTHING;



