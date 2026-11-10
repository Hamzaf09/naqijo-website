import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conversations_channel" AS ENUM('whatsapp', 'messenger', 'instagram', 'test');
  CREATE TYPE "public"."enum_conversations_status" AS ENUM('open', 'pending', 'resolved');
  CREATE TYPE "public"."enum_conversations_ai_mode" AS ENUM('ai', 'human', 'paused');
  CREATE TYPE "public"."enum_conversations_assigned_team" AS ENUM('sales', 'support');
  CREATE TYPE "public"."enum_messages_channel" AS ENUM('whatsapp', 'messenger', 'instagram', 'test');
  CREATE TYPE "public"."enum_messages_direction" AS ENUM('inbound', 'outbound');
  CREATE TYPE "public"."enum_messages_sender_type" AS ENUM('customer', 'ai', 'agent', 'system');
  CREATE TYPE "public"."enum_messages_kind" AS ENUM('text', 'media', 'unsupported', 'template');
  CREATE TYPE "public"."enum_messages_status" AS ENUM('received', 'queued', 'sent', 'delivered', 'read', 'failed', 'blocked');
  CREATE TYPE "public"."enum_customers_channel" AS ENUM('whatsapp', 'messenger', 'instagram', 'test');
  CREATE TYPE "public"."enum_customers_consent_status" AS ENUM('unknown', 'requested', 'granted', 'declined');
  CREATE TYPE "public"."enum_leads_kind" AS ENUM('sales', 'maintenance');
  CREATE TYPE "public"."enum_leads_stage" AS ENUM('new', 'qualifying', 'qualified', 'handed-off', 'won', 'lost');
  CREATE TYPE "public"."enum_appointments_kind" AS ENUM('maintenance', 'installation', 'consultation', 'inspection');
  CREATE TYPE "public"."enum_appointments_status" AS ENUM('requested', 'confirmed', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_handoffs_reason" AS ENUM('complaint', 'human_request', 'technical_uncertain', 'missing_info', 'discount_request', 'warranty_dispute', 'appointment_confirmation', 'high_intent_lead', 'safety', 'unsupported_service', 'existing_order', 'ai_failure');
  CREATE TYPE "public"."enum_handoffs_status" AS ENUM('open', 'claimed', 'resolved');
  CREATE TYPE "public"."enum_handoffs_notify_status" AS ENUM('pending', 'sent', 'partial', 'failed', 'not_configured');
  CREATE TYPE "public"."enum_knowledge_entries_category" AS ENUM('company', 'product', 'price', 'maintenance', 'installation', 'warranty', 'coverage', 'faq', 'booking', 'escalation');
  CREATE TYPE "public"."enum_knowledge_entries_availability" AS ENUM('n/a', 'unconfirmed', 'available', 'unavailable');
  CREATE TYPE "public"."enum_knowledge_entries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__knowledge_entries_v_version_category" AS ENUM('company', 'product', 'price', 'maintenance', 'installation', 'warranty', 'coverage', 'faq', 'booking', 'escalation');
  CREATE TYPE "public"."enum__knowledge_entries_v_version_availability" AS ENUM('n/a', 'unconfirmed', 'available', 'unavailable');
  CREATE TYPE "public"."enum__knowledge_entries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__knowledge_entries_v_published_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_offers_kind" AS ENUM('product', 'maintenance');
  CREATE TYPE "public"."enum_offers_state" AS ENUM('active', 'paused', 'inactive');
  CREATE TYPE "public"."enum_offers_installation_included" AS ENUM('no', 'yes', 'unknown');
  CREATE TYPE "public"."enum_offers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offers_v_version_kind" AS ENUM('product', 'maintenance');
  CREATE TYPE "public"."enum__offers_v_version_state" AS ENUM('active', 'paused', 'inactive');
  CREATE TYPE "public"."enum__offers_v_version_installation_included" AS ENUM('no', 'yes', 'unknown');
  CREATE TYPE "public"."enum__offers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__offers_v_published_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_knowledge_gaps_status" AS ENUM('open', 'answered', 'ignored');
  CREATE TYPE "public"."enum_audit_logs_actor_type" AS ENUM('staff', 'ai', 'system', 'webhook');
  CREATE TYPE "public"."enum_webhook_events_channel" AS ENUM('whatsapp', 'messenger', 'instagram');
  CREATE TYPE "public"."enum_webhook_events_status" AS ENUM('verification', 'processed', 'ignored', 'invalid_signature', 'bad_request', 'error');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'sales';
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'support';
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"thread_key" varchar NOT NULL,
  	"channel" "enum_conversations_channel" NOT NULL,
  	"customer_external_id" varchar NOT NULL,
  	"channel_account_id" varchar,
  	"customer_name" varchar,
  	"customer_id" integer,
  	"status" "enum_conversations_status" DEFAULT 'open',
  	"ai_mode" "enum_conversations_ai_mode" DEFAULT 'ai',
  	"assigned_to_id" integer,
  	"assigned_team" "enum_conversations_assigned_team",
  	"unread_count" numeric DEFAULT 0,
  	"needs_human" boolean DEFAULT false,
  	"last_message_at" timestamp(3) with time zone,
  	"last_inbound_at" timestamp(3) with time zone,
  	"last_message_preview" varchar,
  	"last_intent" varchar,
  	"first_inbound_at" timestamp(3) with time zone,
  	"first_reply_at" timestamp(3) with time zone,
  	"first_human_reply_at" timestamp(3) with time zone,
  	"ai_reply_count" numeric DEFAULT 0,
  	"human_reply_count" numeric DEFAULT 0,
  	"media_strikes" numeric DEFAULT 0,
  	"consent_asked_at" timestamp(3) with time zone,
  	"processing_lock_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"conversation_id" integer NOT NULL,
  	"channel" "enum_messages_channel" NOT NULL,
  	"direction" "enum_messages_direction" NOT NULL,
  	"sender_type" "enum_messages_sender_type" NOT NULL,
  	"sent_by_id" integer,
  	"kind" "enum_messages_kind" DEFAULT 'text',
  	"text" varchar,
  	"external_id" varchar,
  	"dedupe_key" varchar,
  	"status" "enum_messages_status" DEFAULT 'received',
  	"error" varchar,
  	"error_code" varchar,
  	"attempts" numeric DEFAULT 0,
  	"next_retry_at" timestamp(3) with time zone,
  	"processed_at" timestamp(3) with time zone,
  	"process_attempts" numeric DEFAULT 0,
  	"sent_at" timestamp(3) with time zone,
  	"delivered_at" timestamp(3) with time zone,
  	"read_at" timestamp(3) with time zone,
  	"simulated" boolean DEFAULT false,
  	"template" jsonb,
  	"ai_meta" jsonb,
  	"raw" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"identity_key" varchar NOT NULL,
  	"channel" "enum_customers_channel",
  	"display_name" varchar,
  	"name" varchar,
  	"phone" varchar,
  	"area" varchar,
  	"address" varchar,
  	"consent_status" "enum_customers_consent_status" DEFAULT 'unknown',
  	"consent_at" timestamp(3) with time zone,
  	"opted_out" boolean DEFAULT false,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"conversation_id" integer NOT NULL,
  	"customer_id" integer,
  	"kind" "enum_leads_kind" DEFAULT 'sales',
  	"stage" "enum_leads_stage" DEFAULT 'new',
  	"qualified" boolean DEFAULT false,
  	"qualified_at" timestamp(3) with time zone,
  	"product_interest" varchar,
  	"area" varchar,
  	"home_type" varchar,
  	"existing_system" varchar,
  	"problem" varchar,
  	"budget" varchar,
  	"equipment_type" varchar,
  	"brand_model" varchar,
  	"preferred_time" varchar,
  	"address" varchar,
  	"offer_key" varchar,
  	"assigned_to_id" integer,
  	"verified_evidence" varchar,
  	"verified_amount_j_o_d" numeric,
  	"verified_verified_by_id" integer,
  	"verified_verified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"conversation_id" integer NOT NULL,
  	"lead_id" integer,
  	"customer_id" integer,
  	"kind" "enum_appointments_kind" DEFAULT 'maintenance',
  	"status" "enum_appointments_status" DEFAULT 'requested',
  	"requested_window" varchar,
  	"scheduled_for" timestamp(3) with time zone,
  	"address" varchar,
  	"details" varchar,
  	"confirmed_by_id" integer,
  	"confirmed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "handoffs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"conversation_id" integer NOT NULL,
  	"lead_id" integer,
  	"reason" "enum_handoffs_reason" NOT NULL,
  	"status" "enum_handoffs_status" DEFAULT 'open',
  	"summary" jsonb,
  	"summary_text" varchar,
  	"recommended_action" varchar,
  	"unanswered_question" varchar,
  	"notify_status" "enum_handoffs_notify_status" DEFAULT 'pending',
  	"notify_detail" varchar,
  	"notified_at" timestamp(3) with time zone,
  	"assigned_to_id" integer,
  	"resolved_at" timestamp(3) with time zone,
  	"resolved_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "internal_notes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"conversation_id" integer NOT NULL,
  	"author_id" integer,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "knowledge_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"category" "enum_knowledge_entries_category",
  	"availability" "enum_knowledge_entries_availability" DEFAULT 'n/a',
  	"always_include" boolean DEFAULT false,
  	"source" varchar,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"published_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_knowledge_entries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "knowledge_entries_locales" (
  	"title" varchar,
  	"content" varchar,
  	"keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_knowledge_entries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant" varchar DEFAULT 'naqijo',
  	"version_category" "enum__knowledge_entries_v_version_category",
  	"version_availability" "enum__knowledge_entries_v_version_availability" DEFAULT 'n/a',
  	"version_always_include" boolean DEFAULT false,
  	"version_source" varchar,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_published_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__knowledge_entries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__knowledge_entries_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_knowledge_entries_v_locales" (
  	"version_title" varchar,
  	"version_content" varchar,
  	"version_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"key" varchar,
  	"kind" "enum_offers_kind" DEFAULT 'product',
  	"price_j_o_d" numeric,
  	"state" "enum_offers_state" DEFAULT 'active',
  	"installation_included" "enum_offers_installation_included" DEFAULT 'unknown',
  	"installments_allowed" boolean DEFAULT false,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"published_by_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_offers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "offers_locales" (
  	"title" varchar,
  	"scope" varchar,
  	"installation_note" varchar,
  	"warranty_text" varchar,
  	"accessories_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_offers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant" varchar DEFAULT 'naqijo',
  	"version_key" varchar,
  	"version_kind" "enum__offers_v_version_kind" DEFAULT 'product',
  	"version_price_j_o_d" numeric,
  	"version_state" "enum__offers_v_version_state" DEFAULT 'active',
  	"version_installation_included" "enum__offers_v_version_installation_included" DEFAULT 'unknown',
  	"version_installments_allowed" boolean DEFAULT false,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_published_by_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__offers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__offers_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_offers_v_locales" (
  	"version_title" varchar,
  	"version_scope" varchar,
  	"version_installation_note" varchar,
  	"version_warranty_text" varchar,
  	"version_accessories_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "knowledge_gaps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"question" varchar NOT NULL,
  	"normalized_key" varchar NOT NULL,
  	"count" numeric DEFAULT 1,
  	"status" "enum_knowledge_gaps_status" DEFAULT 'open',
  	"last_conversation_id" integer,
  	"last_seen_at" timestamp(3) with time zone,
  	"resolved_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"action" varchar NOT NULL,
  	"actor_type" "enum_audit_logs_actor_type" NOT NULL,
  	"actor_id" integer,
  	"entity" varchar,
  	"entity_id" varchar,
  	"detail" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "webhook_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant" varchar DEFAULT 'naqijo',
  	"channel" "enum_webhook_events_channel" NOT NULL,
  	"status" "enum_webhook_events_status" NOT NULL,
  	"message_count" numeric DEFAULT 0,
  	"status_count" numeric DEFAULT 0,
  	"duplicate_count" numeric DEFAULT 0,
  	"error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "handoffs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "internal_notes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_entries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "offers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_gaps_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_logs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "webhook_events_id" integer;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "messages" ADD CONSTRAINT "messages_sent_by_id_users_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_verified_verified_by_id_users_id_fk" FOREIGN KEY ("verified_verified_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments" ADD CONSTRAINT "appointments_confirmed_by_id_users_id_fk" FOREIGN KEY ("confirmed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_resolved_by_id_users_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_entries" ADD CONSTRAINT "knowledge_entries_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_entries" ADD CONSTRAINT "knowledge_entries_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_entries" ADD CONSTRAINT "knowledge_entries_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_entries_locales" ADD CONSTRAINT "knowledge_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_knowledge_entries_v" ADD CONSTRAINT "_knowledge_entries_v_parent_id_knowledge_entries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."knowledge_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_knowledge_entries_v" ADD CONSTRAINT "_knowledge_entries_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_knowledge_entries_v" ADD CONSTRAINT "_knowledge_entries_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_knowledge_entries_v" ADD CONSTRAINT "_knowledge_entries_v_version_published_by_id_users_id_fk" FOREIGN KEY ("version_published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_knowledge_entries_v_locales" ADD CONSTRAINT "_knowledge_entries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_knowledge_entries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_locales" ADD CONSTRAINT "offers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_parent_id_offers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v" ADD CONSTRAINT "_offers_v_version_published_by_id_users_id_fk" FOREIGN KEY ("version_published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_offers_v_locales" ADD CONSTRAINT "_offers_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_offers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "knowledge_gaps" ADD CONSTRAINT "knowledge_gaps_last_conversation_id_conversations_id_fk" FOREIGN KEY ("last_conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "knowledge_gaps" ADD CONSTRAINT "knowledge_gaps_resolved_by_id_knowledge_entries_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."knowledge_entries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "conversations_tenant_idx" ON "conversations" USING btree ("tenant");
  CREATE UNIQUE INDEX "conversations_thread_key_idx" ON "conversations" USING btree ("thread_key");
  CREATE INDEX "conversations_channel_idx" ON "conversations" USING btree ("channel");
  CREATE INDEX "conversations_customer_external_id_idx" ON "conversations" USING btree ("customer_external_id");
  CREATE INDEX "conversations_customer_idx" ON "conversations" USING btree ("customer_id");
  CREATE INDEX "conversations_status_idx" ON "conversations" USING btree ("status");
  CREATE INDEX "conversations_ai_mode_idx" ON "conversations" USING btree ("ai_mode");
  CREATE INDEX "conversations_assigned_to_idx" ON "conversations" USING btree ("assigned_to_id");
  CREATE INDEX "conversations_needs_human_idx" ON "conversations" USING btree ("needs_human");
  CREATE INDEX "conversations_last_message_at_idx" ON "conversations" USING btree ("last_message_at");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  CREATE INDEX "messages_tenant_idx" ON "messages" USING btree ("tenant");
  CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");
  CREATE INDEX "messages_direction_idx" ON "messages" USING btree ("direction");
  CREATE INDEX "messages_sent_by_idx" ON "messages" USING btree ("sent_by_id");
  CREATE INDEX "messages_external_id_idx" ON "messages" USING btree ("external_id");
  CREATE UNIQUE INDEX "messages_dedupe_key_idx" ON "messages" USING btree ("dedupe_key");
  CREATE INDEX "messages_status_idx" ON "messages" USING btree ("status");
  CREATE INDEX "messages_next_retry_at_idx" ON "messages" USING btree ("next_retry_at");
  CREATE INDEX "messages_processed_at_idx" ON "messages" USING btree ("processed_at");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "customers_tenant_idx" ON "customers" USING btree ("tenant");
  CREATE UNIQUE INDEX "customers_identity_key_idx" ON "customers" USING btree ("identity_key");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE INDEX "leads_tenant_idx" ON "leads" USING btree ("tenant");
  CREATE INDEX "leads_conversation_idx" ON "leads" USING btree ("conversation_id");
  CREATE INDEX "leads_customer_idx" ON "leads" USING btree ("customer_id");
  CREATE INDEX "leads_kind_idx" ON "leads" USING btree ("kind");
  CREATE INDEX "leads_stage_idx" ON "leads" USING btree ("stage");
  CREATE INDEX "leads_qualified_idx" ON "leads" USING btree ("qualified");
  CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to_id");
  CREATE INDEX "leads_verified_verified_verified_by_idx" ON "leads" USING btree ("verified_verified_by_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "appointments_tenant_idx" ON "appointments" USING btree ("tenant");
  CREATE INDEX "appointments_conversation_idx" ON "appointments" USING btree ("conversation_id");
  CREATE INDEX "appointments_lead_idx" ON "appointments" USING btree ("lead_id");
  CREATE INDEX "appointments_customer_idx" ON "appointments" USING btree ("customer_id");
  CREATE INDEX "appointments_status_idx" ON "appointments" USING btree ("status");
  CREATE INDEX "appointments_confirmed_by_idx" ON "appointments" USING btree ("confirmed_by_id");
  CREATE INDEX "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  CREATE INDEX "handoffs_tenant_idx" ON "handoffs" USING btree ("tenant");
  CREATE INDEX "handoffs_conversation_idx" ON "handoffs" USING btree ("conversation_id");
  CREATE INDEX "handoffs_lead_idx" ON "handoffs" USING btree ("lead_id");
  CREATE INDEX "handoffs_status_idx" ON "handoffs" USING btree ("status");
  CREATE INDEX "handoffs_assigned_to_idx" ON "handoffs" USING btree ("assigned_to_id");
  CREATE INDEX "handoffs_resolved_by_idx" ON "handoffs" USING btree ("resolved_by_id");
  CREATE INDEX "handoffs_updated_at_idx" ON "handoffs" USING btree ("updated_at");
  CREATE INDEX "handoffs_created_at_idx" ON "handoffs" USING btree ("created_at");
  CREATE INDEX "internal_notes_tenant_idx" ON "internal_notes" USING btree ("tenant");
  CREATE INDEX "internal_notes_conversation_idx" ON "internal_notes" USING btree ("conversation_id");
  CREATE INDEX "internal_notes_author_idx" ON "internal_notes" USING btree ("author_id");
  CREATE INDEX "internal_notes_updated_at_idx" ON "internal_notes" USING btree ("updated_at");
  CREATE INDEX "internal_notes_created_at_idx" ON "internal_notes" USING btree ("created_at");
  CREATE INDEX "knowledge_entries_tenant_idx" ON "knowledge_entries" USING btree ("tenant");
  CREATE INDEX "knowledge_entries_category_idx" ON "knowledge_entries" USING btree ("category");
  CREATE INDEX "knowledge_entries_created_by_idx" ON "knowledge_entries" USING btree ("created_by_id");
  CREATE INDEX "knowledge_entries_updated_by_idx" ON "knowledge_entries" USING btree ("updated_by_id");
  CREATE INDEX "knowledge_entries_published_by_idx" ON "knowledge_entries" USING btree ("published_by_id");
  CREATE INDEX "knowledge_entries_updated_at_idx" ON "knowledge_entries" USING btree ("updated_at");
  CREATE INDEX "knowledge_entries_created_at_idx" ON "knowledge_entries" USING btree ("created_at");
  CREATE INDEX "knowledge_entries__status_idx" ON "knowledge_entries" USING btree ("_status");
  CREATE UNIQUE INDEX "knowledge_entries_locales_locale_parent_id_unique" ON "knowledge_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_knowledge_entries_v_parent_idx" ON "_knowledge_entries_v" USING btree ("parent_id");
  CREATE INDEX "_knowledge_entries_v_version_version_tenant_idx" ON "_knowledge_entries_v" USING btree ("version_tenant");
  CREATE INDEX "_knowledge_entries_v_version_version_category_idx" ON "_knowledge_entries_v" USING btree ("version_category");
  CREATE INDEX "_knowledge_entries_v_version_version_created_by_idx" ON "_knowledge_entries_v" USING btree ("version_created_by_id");
  CREATE INDEX "_knowledge_entries_v_version_version_updated_by_idx" ON "_knowledge_entries_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_knowledge_entries_v_version_version_published_by_idx" ON "_knowledge_entries_v" USING btree ("version_published_by_id");
  CREATE INDEX "_knowledge_entries_v_version_version_updated_at_idx" ON "_knowledge_entries_v" USING btree ("version_updated_at");
  CREATE INDEX "_knowledge_entries_v_version_version_created_at_idx" ON "_knowledge_entries_v" USING btree ("version_created_at");
  CREATE INDEX "_knowledge_entries_v_version_version__status_idx" ON "_knowledge_entries_v" USING btree ("version__status");
  CREATE INDEX "_knowledge_entries_v_created_at_idx" ON "_knowledge_entries_v" USING btree ("created_at");
  CREATE INDEX "_knowledge_entries_v_updated_at_idx" ON "_knowledge_entries_v" USING btree ("updated_at");
  CREATE INDEX "_knowledge_entries_v_snapshot_idx" ON "_knowledge_entries_v" USING btree ("snapshot");
  CREATE INDEX "_knowledge_entries_v_published_locale_idx" ON "_knowledge_entries_v" USING btree ("published_locale");
  CREATE INDEX "_knowledge_entries_v_latest_idx" ON "_knowledge_entries_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_knowledge_entries_v_locales_locale_parent_id_unique" ON "_knowledge_entries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offers_tenant_idx" ON "offers" USING btree ("tenant");
  CREATE UNIQUE INDEX "offers_key_idx" ON "offers" USING btree ("key");
  CREATE INDEX "offers_state_idx" ON "offers" USING btree ("state");
  CREATE INDEX "offers_created_by_idx" ON "offers" USING btree ("created_by_id");
  CREATE INDEX "offers_updated_by_idx" ON "offers" USING btree ("updated_by_id");
  CREATE INDEX "offers_published_by_idx" ON "offers" USING btree ("published_by_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE INDEX "offers__status_idx" ON "offers" USING btree ("_status");
  CREATE UNIQUE INDEX "offers_locales_locale_parent_id_unique" ON "offers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_offers_v_parent_idx" ON "_offers_v" USING btree ("parent_id");
  CREATE INDEX "_offers_v_version_version_tenant_idx" ON "_offers_v" USING btree ("version_tenant");
  CREATE INDEX "_offers_v_version_version_key_idx" ON "_offers_v" USING btree ("version_key");
  CREATE INDEX "_offers_v_version_version_state_idx" ON "_offers_v" USING btree ("version_state");
  CREATE INDEX "_offers_v_version_version_created_by_idx" ON "_offers_v" USING btree ("version_created_by_id");
  CREATE INDEX "_offers_v_version_version_updated_by_idx" ON "_offers_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_offers_v_version_version_published_by_idx" ON "_offers_v" USING btree ("version_published_by_id");
  CREATE INDEX "_offers_v_version_version_updated_at_idx" ON "_offers_v" USING btree ("version_updated_at");
  CREATE INDEX "_offers_v_version_version_created_at_idx" ON "_offers_v" USING btree ("version_created_at");
  CREATE INDEX "_offers_v_version_version__status_idx" ON "_offers_v" USING btree ("version__status");
  CREATE INDEX "_offers_v_created_at_idx" ON "_offers_v" USING btree ("created_at");
  CREATE INDEX "_offers_v_updated_at_idx" ON "_offers_v" USING btree ("updated_at");
  CREATE INDEX "_offers_v_snapshot_idx" ON "_offers_v" USING btree ("snapshot");
  CREATE INDEX "_offers_v_published_locale_idx" ON "_offers_v" USING btree ("published_locale");
  CREATE INDEX "_offers_v_latest_idx" ON "_offers_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_offers_v_locales_locale_parent_id_unique" ON "_offers_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "knowledge_gaps_tenant_idx" ON "knowledge_gaps" USING btree ("tenant");
  CREATE UNIQUE INDEX "knowledge_gaps_normalized_key_idx" ON "knowledge_gaps" USING btree ("normalized_key");
  CREATE INDEX "knowledge_gaps_status_idx" ON "knowledge_gaps" USING btree ("status");
  CREATE INDEX "knowledge_gaps_last_conversation_idx" ON "knowledge_gaps" USING btree ("last_conversation_id");
  CREATE INDEX "knowledge_gaps_resolved_by_idx" ON "knowledge_gaps" USING btree ("resolved_by_id");
  CREATE INDEX "knowledge_gaps_updated_at_idx" ON "knowledge_gaps" USING btree ("updated_at");
  CREATE INDEX "knowledge_gaps_created_at_idx" ON "knowledge_gaps" USING btree ("created_at");
  CREATE INDEX "audit_logs_tenant_idx" ON "audit_logs" USING btree ("tenant");
  CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
  CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");
  CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs" USING btree ("entity_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "webhook_events_tenant_idx" ON "webhook_events" USING btree ("tenant");
  CREATE INDEX "webhook_events_channel_idx" ON "webhook_events" USING btree ("channel");
  CREATE INDEX "webhook_events_status_idx" ON "webhook_events" USING btree ("status");
  CREATE INDEX "webhook_events_updated_at_idx" ON "webhook_events" USING btree ("updated_at");
  CREATE INDEX "webhook_events_created_at_idx" ON "webhook_events" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_handoffs_fk" FOREIGN KEY ("handoffs_id") REFERENCES "public"."handoffs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_internal_notes_fk" FOREIGN KEY ("internal_notes_id") REFERENCES "public"."internal_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_entries_fk" FOREIGN KEY ("knowledge_entries_id") REFERENCES "public"."knowledge_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_gaps_fk" FOREIGN KEY ("knowledge_gaps_id") REFERENCES "public"."knowledge_gaps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webhook_events_fk" FOREIGN KEY ("webhook_events_id") REFERENCES "public"."webhook_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");
  CREATE INDEX "payload_locked_documents_rels_handoffs_id_idx" ON "payload_locked_documents_rels" USING btree ("handoffs_id");
  CREATE INDEX "payload_locked_documents_rels_internal_notes_id_idx" ON "payload_locked_documents_rels" USING btree ("internal_notes_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_entries_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_gaps_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_gaps_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_webhook_events_id_idx" ON "payload_locked_documents_rels" USING btree ("webhook_events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "appointments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "handoffs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "internal_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_entries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_knowledge_entries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_knowledge_entries_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offers_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_offers_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_gaps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_logs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "webhook_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "conversations" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "appointments" CASCADE;
  DROP TABLE "handoffs" CASCADE;
  DROP TABLE "internal_notes" CASCADE;
  DROP TABLE "knowledge_entries" CASCADE;
  DROP TABLE "knowledge_entries_locales" CASCADE;
  DROP TABLE "_knowledge_entries_v" CASCADE;
  DROP TABLE "_knowledge_entries_v_locales" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "offers_locales" CASCADE;
  DROP TABLE "_offers_v" CASCADE;
  DROP TABLE "_offers_v_locales" CASCADE;
  DROP TABLE "knowledge_gaps" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "webhook_events" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_handoffs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_internal_notes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_entries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_offers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_gaps_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audit_logs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_webhook_events_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'viewer'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'editor', 'content-manager', 'viewer');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'viewer'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_customers_id_idx";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_appointments_id_idx";
  DROP INDEX "payload_locked_documents_rels_handoffs_id_idx";
  DROP INDEX "payload_locked_documents_rels_internal_notes_id_idx";
  DROP INDEX "payload_locked_documents_rels_knowledge_entries_id_idx";
  DROP INDEX "payload_locked_documents_rels_offers_id_idx";
  DROP INDEX "payload_locked_documents_rels_knowledge_gaps_id_idx";
  DROP INDEX "payload_locked_documents_rels_audit_logs_id_idx";
  DROP INDEX "payload_locked_documents_rels_webhook_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "handoffs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "internal_notes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_entries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "offers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_gaps_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_logs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "webhook_events_id";
  DROP TYPE "public"."enum_conversations_channel";
  DROP TYPE "public"."enum_conversations_status";
  DROP TYPE "public"."enum_conversations_ai_mode";
  DROP TYPE "public"."enum_conversations_assigned_team";
  DROP TYPE "public"."enum_messages_channel";
  DROP TYPE "public"."enum_messages_direction";
  DROP TYPE "public"."enum_messages_sender_type";
  DROP TYPE "public"."enum_messages_kind";
  DROP TYPE "public"."enum_messages_status";
  DROP TYPE "public"."enum_customers_channel";
  DROP TYPE "public"."enum_customers_consent_status";
  DROP TYPE "public"."enum_leads_kind";
  DROP TYPE "public"."enum_leads_stage";
  DROP TYPE "public"."enum_appointments_kind";
  DROP TYPE "public"."enum_appointments_status";
  DROP TYPE "public"."enum_handoffs_reason";
  DROP TYPE "public"."enum_handoffs_status";
  DROP TYPE "public"."enum_handoffs_notify_status";
  DROP TYPE "public"."enum_knowledge_entries_category";
  DROP TYPE "public"."enum_knowledge_entries_availability";
  DROP TYPE "public"."enum_knowledge_entries_status";
  DROP TYPE "public"."enum__knowledge_entries_v_version_category";
  DROP TYPE "public"."enum__knowledge_entries_v_version_availability";
  DROP TYPE "public"."enum__knowledge_entries_v_version_status";
  DROP TYPE "public"."enum__knowledge_entries_v_published_locale";
  DROP TYPE "public"."enum_offers_kind";
  DROP TYPE "public"."enum_offers_state";
  DROP TYPE "public"."enum_offers_installation_included";
  DROP TYPE "public"."enum_offers_status";
  DROP TYPE "public"."enum__offers_v_version_kind";
  DROP TYPE "public"."enum__offers_v_version_state";
  DROP TYPE "public"."enum__offers_v_version_installation_included";
  DROP TYPE "public"."enum__offers_v_version_status";
  DROP TYPE "public"."enum__offers_v_published_locale";
  DROP TYPE "public"."enum_knowledge_gaps_status";
  DROP TYPE "public"."enum_audit_logs_actor_type";
  DROP TYPE "public"."enum_webhook_events_channel";
  DROP TYPE "public"."enum_webhook_events_status";`)
}
