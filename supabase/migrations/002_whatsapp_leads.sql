-- Migration: WhatsApp leads and message tracking
-- Purpose: Store leads captured via WhatsApp bot and log all conversations

-- WhatsApp leads table (one row per unique phone number)
CREATE TABLE whatsapp_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text UNIQUE NOT NULL,
  name text,
  company_name text,
  trade text,
  location_state text,
  company_size text,
  funnel_stage text NOT NULL DEFAULT 'new'
    CHECK (funnel_stage IN (
      'new', 'greeting', 'qualifying_name', 'qualifying_trade',
      'qualifying_location', 'qualifying_size', 'qualified',
      'sales_handoff', 'not_interested'
    )),
  qualified_at timestamptz,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_whatsapp_leads_funnel_stage ON whatsapp_leads(funnel_stage);
CREATE INDEX idx_whatsapp_leads_created_at ON whatsapp_leads(created_at DESC);

-- WhatsApp messages log (append-only conversation history)
CREATE TABLE whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid NOT NULL REFERENCES whatsapp_leads(id) ON DELETE CASCADE,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  body text,
  wa_message_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Indexes for message queries
CREATE INDEX idx_whatsapp_messages_lead_id ON whatsapp_messages(lead_id, created_at);

-- Auto-update updated_at on whatsapp_leads
CREATE OR REPLACE FUNCTION update_whatsapp_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_whatsapp_leads_updated_at
  BEFORE UPDATE ON whatsapp_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_leads_updated_at();
