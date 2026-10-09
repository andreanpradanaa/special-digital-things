-- Skema database services/api (PostgreSQL), digabung dari services/api/migrations/*.up.sql
-- Dibuat: 2026-10-09. Sumber kebenaran tetap folder migrations (golang-migrate, jalan otomatis saat startup).
-- Regenerasi: cat services/api/migrations/*.up.sql

-- ===== 000001_create_orders.up.sql
CREATE TABLE IF NOT EXISTS orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code      TEXT NOT NULL UNIQUE,
    idempotency_key TEXT UNIQUE,
    public_slug     TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'expired', 'cancelled')),
    amount          BIGINT NOT NULL CHECK (amount > 0),
    currency        TEXT NOT NULL DEFAULT 'IDR',
    box_payload     JSONB NOT NULL,
    sender_name     TEXT NOT NULL,
    sender_email    TEXT NOT NULL,
    sender_phone    TEXT NOT NULL DEFAULT '',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- ===== 000002_create_payments.up.sql
CREATE TABLE IF NOT EXISTS payments (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id           UUID NOT NULL UNIQUE REFERENCES orders (id) ON DELETE CASCADE,
    snap_token         TEXT NOT NULL DEFAULT '',
    snap_redirect_url  TEXT NOT NULL DEFAULT '',
    transaction_id     TEXT NOT NULL DEFAULT '',
    transaction_status TEXT NOT NULL DEFAULT '',
    fraud_status       TEXT NOT NULL DEFAULT '',
    payment_type       TEXT NOT NULL DEFAULT '',
    gross_amount       TEXT NOT NULL DEFAULT '',
    status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'success', 'failed', 'expired', 'cancelled', 'refunded')),
    paid_at            TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== 000003_create_payment_notifications.up.sql
CREATE TABLE IF NOT EXISTS payment_notifications (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code         TEXT NOT NULL,
    transaction_id     TEXT NOT NULL,
    status_code        TEXT NOT NULL,
    gross_amount       TEXT NOT NULL,
    transaction_status TEXT NOT NULL,
    payload            JSONB NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Dedupe idempotency: notifikasi ulang dari Midtrans punya kombinasi identik
    UNIQUE (order_code, transaction_id, status_code, gross_amount)
);

CREATE INDEX IF NOT EXISTS idx_payment_notifications_order ON payment_notifications (order_code);

