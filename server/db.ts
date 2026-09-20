import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "p2ip_crm.db");
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for better concurrency
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize relational tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL, -- 'partner' | 'admin'
      partner_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      organisation TEXT NOT NULL,
      partner_type TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      location TEXT NOT NULL,
      joining_date TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'STARTER', -- STARTER, BUILDER, GROWTH, PRO, ELITE
      status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL, ACTIVE, SUSPENDED, REJECTED
      referral_url TEXT NOT NULL,
      monthly_target INTEGER NOT NULL DEFAULT 20,
      custom_commission_rate REAL,
      password TEXT,
      two_step_pin TEXT,
      two_step_enabled INTEGER NOT NULL DEFAULT 1,
      pan_number TEXT,
      aadhaar_number TEXT,
      terms_accepted INTEGER NOT NULL DEFAULT 1,
      terms_accepted_at TEXT NOT NULL,
      terms_version TEXT NOT NULL DEFAULT 'v1.3',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS partner_profiles (
      partner_id TEXT PRIMARY KEY,
      bio TEXT,
      specialties TEXT,
      kyc_status TEXT NOT NULL DEFAULT 'VERIFIED',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT,
      location TEXT,
      partner_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      client_id TEXT,
      client_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      program_id TEXT NOT NULL,
      program_name TEXT NOT NULL,
      source TEXT NOT NULL,
      notes TEXT,
      preferred_contact_time TEXT,
      consent INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'NEW',
      -- 'NEW' | 'CONTACTED' | 'REGISTERED' | 'CHALLENGE_ATTENDED' | 'CHALLENGE_COMPLETED' | 'PAID_CUSTOMER' | 'RENEWAL' | 'LOST'
      attribution_status TEXT NOT NULL DEFAULT 'NORMAL',
      duplicate_partner_id TEXT,
      paid_amount REAL DEFAULT 0,
      commission_earned REAL DEFAULT 0,
      converted_date TEXT,
      owner TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      billing_type TEXT NOT NULL, -- 'free', 'monthly', 'quarterly', 'annual', 'one_time'
      duration TEXT NOT NULL,
      category TEXT NOT NULL,
      partner_commission_percentage REAL NOT NULL DEFAULT 50,
      partner_activation_reward REAL NOT NULL DEFAULT 0,
      partner_bonus REAL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      eligibility TEXT,
      referral_rules TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      customer_name TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      partner_id TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      referral_id TEXT,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      gateway TEXT NOT NULL DEFAULT 'MANUAL_VERIFIED', -- 'RAZORPAY' | 'MANUAL_VERIFIED' | 'UPI'
      gateway_transaction_id TEXT,
      payment_status TEXT NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED'
      payment_date TEXT NOT NULL,
      refund_status TEXT DEFAULT 'NONE',
      refunded_amount REAL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS commissions (
      id TEXT PRIMARY KEY,
      payment_id TEXT,
      partner_id TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      referral_id TEXT,
      client_name TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      collected_revenue REAL NOT NULL,
      commission_percentage REAL NOT NULL,
      commission_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'APPROVED', -- 'PENDING', 'APPROVED', 'PAYABLE', 'PAID', 'REVERSED', 'CANCELLED'
      created_at TEXT NOT NULL,
      approved_at TEXT,
      payable_at TEXT,
      paid_at TEXT,
      reversed_at TEXT,
      reversal_reason TEXT,
      payout_ref_number TEXT
    );

    CREATE TABLE IF NOT EXISTS commission_transactions (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      type TEXT NOT NULL, -- 'COMMISSION' | 'BONUS' | 'REVERSAL' | 'PAYOUT' | 'ADJUSTMENT'
      amount REAL NOT NULL,
      reference_id TEXT,
      reference_type TEXT,
      description TEXT NOT NULL,
      balance_after REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bonuses (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      bonus_type TEXT NOT NULL,
      amount REAL NOT NULL,
      qualification_referrals INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'AWARDED',
      awarded_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payout_accounts (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      method TEXT NOT NULL, -- 'BANK_ACCOUNT' | 'UPI'
      account_holder_name TEXT NOT NULL,
      bank_name TEXT,
      account_number_masked TEXT,
      account_number_raw TEXT, -- stored securely for processing
      ifsc_code TEXT,
      account_type TEXT DEFAULT 'SAVINGS',
      upi_id TEXT,
      is_primary INTEGER NOT NULL DEFAULT 1,
      is_verified INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payouts (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      payout_account_id TEXT,
      requested_amount REAL NOT NULL,
      approved_amount REAL NOT NULL,
      actual_paid_amount REAL NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL, -- 'UPI' | 'BANK_TRANSFER' | 'RAZORPAYX'
      destination_masked TEXT NOT NULL,
      gateway TEXT NOT NULL DEFAULT 'MANUAL_UPI', -- 'MANUAL_UPI' | 'MANUAL_BANK' | 'RAZORPAYX'
      gateway_payout_id TEXT,
      utr TEXT,
      status TEXT NOT NULL DEFAULT 'REQUESTED',
      -- 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REJECTED' | 'CANCELLED'
      failure_reason TEXT,
      admin_notes TEXT,
      proof_url TEXT,
      requested_at TEXT NOT NULL,
      approved_at TEXT,
      paid_at TEXT,
      processed_by TEXT
    );

    CREATE TABLE IF NOT EXISTS followups (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      lead_name TEXT NOT NULL,
      partner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      status TEXT NOT NULL DEFAULT 'PENDING',
      action_type TEXT NOT NULL DEFAULT 'WHATSAPP',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_role TEXT NOT NULL DEFAULT 'partner',
      recipient_partner_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'alert',
      timestamp TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      link_tab TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actor TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      reason TEXT
    );

    CREATE TABLE IF NOT EXISTS business_rules (
      id TEXT PRIMARY KEY DEFAULT 'default',
      default_commission_percentage REAL NOT NULL DEFAULT 50,
      challenge_activation_reward REAL NOT NULL DEFAULT 49,
      client_inner_circle_credit REAL NOT NULL DEFAULT 49,
      partner_inner_circle_credit REAL NOT NULL DEFAULT 49,
      validation_period_days INTEGER NOT NULL DEFAULT 7,
      minimum_payout_amount REAL NOT NULL DEFAULT 500,
      leaderboard_visible INTEGER NOT NULL DEFAULT 1,
      duplicate_protection_strict INTEGER NOT NULL DEFAULT 1,
      terms_version TEXT NOT NULL DEFAULT 'v1.3'
    );
  `);

  // Ensure default business rules exist
  const rules = db.prepare("SELECT id FROM business_rules WHERE id = 'default'").get();
  if (!rules) {
    db.prepare(`
      INSERT INTO business_rules (
        id, default_commission_percentage, challenge_activation_reward,
        validation_period_days, minimum_payout_amount, terms_version
      ) VALUES ('default', 50, 49, 7, 500, 'v1.3')
    `).run();
  }

  // Ensure real product catalogue exists
  const existingProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (existingProducts.count === 0) {
    const defaultProducts = [
      {
        id: "prod-free-reset",
        name: "FREE 5-Day Mind Reset Challenge",
        tagline: "Break free from stress, overwhelm & mental exhaustion in 15 mins a day.",
        description: "Live interactive evening micro-challenge with certified breathwork and inner peace guidance.",
        price: 0,
        billing_type: "free",
        duration: "5 Consecutive Evenings (45 Mins/Day)",
        category: "5-Day Challenge",
        partner_commission_percentage: 0,
        partner_activation_reward: 49,
        is_active: 1,
        eligibility: "Open to all adults seeking mental clarity and stress relief",
        referral_rules: "₹49 activation reward credited upon verified challenge registration.",
      },
      {
        id: "prod-basic-shift",
        name: "Basic Shift",
        tagline: "Foundational mental reset & daily habit anchoring.",
        description: "Core mindfulness architecture, daily guided audio practices, and nervous system regulation.",
        price: 199,
        billing_type: "monthly",
        duration: "Monthly Ongoing",
        category: "Stress Management",
        partner_commission_percentage: 50,
        partner_activation_reward: 0,
        is_active: 1,
        eligibility: "Individuals transitioning from 5-Day Challenge",
        referral_rules: "50% recurring monthly commission (₹99.50/month per active subscriber).",
      },
      {
        id: "prod-mind-mastery",
        name: "Mind Mastery",
        tagline: "Deep cognitive restructuring & emotional equilibrium.",
        description: "21-Day intensive cognitive training, breath control, emotional resilience, and live Q&A circles.",
        price: 499,
        billing_type: "monthly",
        duration: "21-Day Intensive + 30 Days Community Access",
        category: "Mind Mastery",
        partner_commission_percentage: 50,
        partner_activation_reward: 0,
        is_active: 1,
        eligibility: "Dedicated seekers wanting structured personal transformation",
        referral_rules: "50% commission (₹249.50/month per enrolled client).",
      },
      {
        id: "prod-transformation-elite",
        name: "Inner Transformation Elite",
        tagline: "Comprehensive executive wellness & personalised master mentorship.",
        description: "VIP high-touch mentoring with 1-on-1 counselor guidance, biofeedback breathing protocols, and priority support.",
        price: 1499,
        billing_type: "monthly",
        duration: "4 Weeks High-Touch Mentorship",
        category: "Personal Transformation",
        partner_commission_percentage: 50,
        partner_activation_reward: 0,
        is_active: 1,
        eligibility: "Corporate executives, entrepreneurs, and high-responsibility leaders",
        referral_rules: "50% commission (₹749.50/month per enrolled client).",
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, tagline, description, price, billing_type, duration,
        category, partner_commission_percentage, partner_activation_reward,
        is_active, eligibility, referral_rules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of defaultProducts) {
      stmt.run(
        p.id,
        p.name,
        p.tagline,
        p.description,
        p.price,
        p.billing_type,
        p.duration,
        p.category,
        p.partner_commission_percentage,
        p.partner_activation_reward,
        p.is_active,
        p.eligibility,
        p.referral_rules
      );
    }
  }
}

// Initialize on module load
initDatabase();

export { db };
