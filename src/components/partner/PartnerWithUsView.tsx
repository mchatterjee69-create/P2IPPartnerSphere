import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Building2,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Users,
  Wallet,
  Zap,
  TrendingUp,
  Percent,
  Coins,
  ChevronRight,
  Check,
  Clock,
  Award,
} from "lucide-react";

interface VerticalConfig {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  commissionRate: string;
  averageDealSize: string;
  projectedEarnings: string;
  targetAudience: string[];
  recommendedPrograms: string[];
  keyPitch: string;
}

const ATTACHED_VERTICALS: VerticalConfig[] = [
  {
    id: "healthcare",
    title: "Healthcare, Doctors & Clinical Therapists",
    category: "Clinical & Health Services",
    icon: Stethoscope,
    description:
      "Integrate clinical mindfulness and evidence-backed breathwork into patient care pathways for stress, hypertension, insomnia, and psychosomatic wellness.",
    commissionRate: "20% - 25% Recurring",
    averageDealSize: "₹4,999 - ₹14,999 per patient",
    projectedEarnings: "₹25,000 - ₹60,000 / mo (15-20 referrals)",
    targetAudience: [
      "Psychiatrists & Clinical Psychologists",
      "Cardiologists & Neurologists (Stress Management)",
      "General Physicians & Family Doctors",
      "Integrative Medicine & Ayush Clinics",
    ],
    recommendedPrograms: [
      "5-Day Free Mind Reset (Patient Trial)",
      "21-Day Mind Mastery Intensive (₹4,999)",
      "1-on-1 Emotional Breakthrough Therapy (₹14,999)",
    ],
    keyPitch:
      "Offer patients a clinically gentle, zero-pharmaceutical protocol that improves treatment adherence and reduces stress markers.",
  },
  {
    id: "corporate",
    title: "Corporate HR, Enterprises & CXO Teams",
    category: "B2B Enterprise Wellness",
    icon: Building2,
    description:
      "Combat executive burnout, enhance high-stakes focus, and build emotional intelligence for engineering, sales, and leadership teams.",
    commissionRate: "15% - 25% per Contract",
    averageDealSize: "₹45,000 - ₹2,50,000 per workshop",
    projectedEarnings: "₹45,000 - ₹1,20,000 / contract",
    targetAudience: [
      "Chief Human Resources Officers (CHROs) & HR Heads",
      "Learning & Development (L&D) Directors",
      "Tech Startup Founders & Operations Leaders",
      "Corporate Wellness & Employee Experience Committees",
    ],
    recommendedPrograms: [
      "Corporate Executive Focus & Resilience Workshop",
      "Quarterly Team Burnout Reset Sprint",
      "Annual Leadership Mindfulness Retainership",
    ],
    keyPitch:
      "Directly reduce absenteeism and employee churn while elevating focus and retention with measurable stress metrics.",
  },
  {
    id: "yoga-fitness",
    title: "Yoga Studios, Gyms & Naturopathy Centers",
    category: "Fitness & Mind-Body Studios",
    icon: Dumbbell,
    description:
      "Complement physical strength and asana practices with deep pranayama, parasympathetic nervous system down-regulation, and meditation.",
    commissionRate: "20% Flat Commission",
    averageDealSize: "₹3,499 - ₹9,999 per client",
    projectedEarnings: "₹30,000 - ₹75,000 / mo (20-30 members)",
    targetAudience: [
      "Independent Yoga Studio Owners & Teachers",
      "Pilates, Crossfit & High-Performance Trainers",
      "Naturopathy & Ayurvedic Wellness Retreats",
      "Physiotherapy & Sports Rehabilitation Clinics",
    ],
    recommendedPrograms: [
      "Yogic Breathwork & Deep Sleep Reset",
      "Mind Mastery 21-Day Daily Immersion",
      "Chakra & Prana Alignment Masterclass",
    ],
    keyPitch:
      "Monetize existing gym and studio footfalls by offering mind wellness without hiring additional full-time instructors.",
  },
  {
    id: "education",
    title: "Educational Institutions, Colleges & Academies",
    category: "Higher Education & Academia",
    icon: GraduationCap,
    description:
      "Empower institutional clients, academic faculty, and candidates to conquer exam anxiety, overcome attention deficit from digital fatigue, and cultivate deep focus.",
    commissionRate: "15% Institutional Grant Share",
    averageDealSize: "₹25,000 - ₹1,00,000 per rollout",
    projectedEarnings: "₹25,000 - ₹80,000 / institution",
    targetAudience: [
      "University Deans & College Principals",
      "Client Counseling & Campus Mental Health Cells",
      "Competitive Exam Coaching Institutes (IIT-JEE / NEET / UPSC)",
      "K-12 School Management & Parent-Teacher Associations",
    ],
    recommendedPrograms: [
      "Competitive Exam & Focus Enhancement Sprint",
      "Teacher Stress Reduction & Vocal Harmony",
      "Academic Mindfulness Foundation Certificate",
    ],
    keyPitch:
      "Directly improve client academic performance, memory retention, and mental well-being during stressful assessment cycles.",
  },
  {
    id: "coaches",
    title: "Life Coaches, Therapists & Holistic Practitioners",
    category: "Independent Practitioners",
    icon: HeartHandshake,
    description:
      "Supercharge your 1-on-1 coaching outcomes by prescribing structured daily meditation and reflective journals between coaching sessions.",
    commissionRate: "25% Lifetime Attribution",
    averageDealSize: "₹4,999 - ₹19,999 per client",
    projectedEarnings: "₹20,000 - ₹50,000 / mo",
    targetAudience: [
      "Executive & Leadership Career Coaches",
      "Relationship & Family Life Counselors",
      "Hypnotherapists, NLP Practitioners & Sound Healers",
      "Spiritual Mentors & Astrology Counselors",
    ],
    recommendedPrograms: [
      "Inner Child Healing & Emotional Balance",
      "21-Day Mind Mastery Cohort",
      "P2IP Certified Meditation Practitioner Track",
    ],
    keyPitch:
      "Deliver daily guided practices to your clients without spending personal hours recording or moderating sessions.",
  },
  {
    id: "community",
    title: "Community Organizations, NGOs & Spiritual Ashrams",
    category: "Social Impact & Community",
    icon: Users,
    description:
      "Bring authentic meditation, peace, and values-based living to resident welfare associations (RWAs), temples, ashrams, and non-profits.",
    commissionRate: "15% Community Welfare Credit",
    averageDealSize: "Custom Community Honorarium",
    projectedEarnings: "₹15,000 - ₹40,000 / event",
    targetAudience: [
      "Resident Welfare Associations (RWAs) & Housing Societies",
      "Senior Citizen Clubs & Rotary / Lions Organizations",
      "Spiritual Ashrams & Satsang Mandals",
      "Non-Profit Community Centers & Foundations",
    ],
    recommendedPrograms: [
      "Free Community Mind Reset Morning Satsangs",
      "Golden Age Serenity (Seniors Protocol)",
      "Seva Partner Impact Initiative",
    ],
    keyPitch:
      "Nurture a harmonious, peaceful community atmosphere while generating sustainable revenue for your organization's social causes.",
  },
];

export const PartnerWithUsView: React.FC = () => {
  const [selectedVertical, setSelectedVertical] = useState<string>("healthcare");
  const [monthlyReferrals, setMonthlyReferrals] = useState<number>(15);
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(4999);

  const activeVertical =
    ATTACHED_VERTICALS.find((v) => v.id === selectedVertical) || ATTACHED_VERTICALS[0];

  // Calculate earnings
  const estimatedRevenue = monthlyReferrals * avgTicketPrice;
  const estimatedCommission = Math.round(estimatedRevenue * 0.2); // 20% average

  const REGISTER_URL = "https://p2-ip-partner-sphere.vercel.app/";

  return (
    <div className="space-y-8 animate-fade-in pb-16" id="partner-with-us-view">
      {/* 1. HERO SECTION (Kept pristine with serenity hero imagery & high-converting CTA) */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#0F5132]/20">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
            alt="Mindfulness & Inner Peace"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5132]/95 via-[#0F5132]/85 to-[#0b3d26]/75" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0F5132]/40 to-[#0F5132]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 text-white max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5D77F] text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Official P2IP Refer & Earn Program
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Partner With Us. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D77F] to-[#FFE8A3]">
              Refer & Earn Across High-Impact Verticals.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            Transform lives through authentic mindfulness and breathwork while building a reliable,
            high-margin recurring revenue stream. Designed specifically for healthcare providers,
            corporates, studios, educators, and community leaders.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-[#F5D77F]">Up to 50%</div>
              <div className="text-[11px] text-emerald-100 font-medium">Commission Structure</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-[#F5D77F]">Instant Payouts</div>
              <div className="text-[11px] text-emerald-100 font-medium">Bank, UPI & Razorpay ID</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-black text-[#F5D77F]">Zero Hard Selling</div>
              <div className="text-[11px] text-emerald-100 font-medium">Free 5-Day Mind Reset Funnel</div>
            </div>
          </div>

          {/* Primary CTA - Leads to https://p2-ip-partner-sphere.vercel.app/ */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              id="register-partner-hero-cta"
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#e5be47] to-[#D4AF37] hover:from-[#c29e2f] hover:to-[#b59024] text-[#0F5132] font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition transform active:scale-98 cursor-pointer border border-amber-300"
            >
              <span>Register Now & Be Our Partner</span>
              <ArrowRight className="w-5 h-5 text-[#0F5132]" />
            </a>

            <div className="flex items-center gap-2 text-xs text-emerald-100 px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-[#F5D77F]" />
              <span>Instant Accreditation • Direct Bank & Razorpay Payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOW REFER & EARN WORKS (3-STEP ENGINE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F5132] text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Simple Turnkey Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            How Refer & Earn Works for Your Practice
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            You introduce trust; our certified faculties deliver life-changing transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#F8F9F8] to-[#E8F5E9]/30 border border-emerald-100 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center font-black text-sm shadow-sm">
                01
              </div>
              <h3 className="text-base font-extrabold text-gray-900">
                Gift the 100% Free 5-Day Mind Reset
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Invite clients, patients, or employees using your personalized QR code or accredited
                link. There is no cost, no credit card required, and zero sales resistance.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-bold text-[#0F5132] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 90-day cookie & attribution lock
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#F8F9F8] to-[#E8F5E9]/30 border border-emerald-100 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center font-black text-sm shadow-sm">
                02
              </div>
              <h3 className="text-base font-extrabold text-gray-900">
                Immersive Transformation & Nurturing
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Participants attend live daily breathwork sessions guided by senior meditation
                masters. Over 68% experience measurable sleep and anxiety improvements within 5 days.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-bold text-[#0F5132] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full institutional accountability
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#F8F9F8] to-[#E8F5E9]/30 border border-emerald-100 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center font-black text-sm shadow-sm">
                03
              </div>
              <h3 className="text-base font-extrabold text-gray-900">
                Direct Payouts via Razorpay & Bank
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                When your referred clients upgrade to deep cohorts, masterclasses, or retreats,
                commissions are automatically credited. Trigger instant payouts anytime to your
                Razorpay ID or UPI.
              </p>
            </div>
            <div className="pt-4 text-[11px] font-bold text-[#0F5132] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant settlement via RazorpayX
            </div>
          </div>
        </div>
      </div>

      {/* 3. ATTACHED VERTICALS DEEP-DIVE SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#0F5132] uppercase tracking-wider mb-1">
              Tailored Commercial Models
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Attached Verticals & Earnings Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select your vertical to explore dedicated commission rates, recommended client
              funnels, and pitch talking points.
            </p>
          </div>

          <a
            id="register-partner-vertical-cta"
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#125838] text-white text-xs font-bold shadow-sm transition shrink-0"
          >
            <span>Register Now & Be Our Partner</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F5D77F]" />
          </a>
        </div>

        {/* Verticals Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {ATTACHED_VERTICALS.map((v) => {
            const Icon = v.icon;
            const isSelected = v.id === selectedVertical;
            return (
              <button
                key={v.id}
                id={`vertical-tab-${v.id}`}
                onClick={() => setSelectedVertical(v.id)}
                className={`p-3 rounded-2xl text-left transition flex flex-col gap-2 cursor-pointer border ${
                  isSelected
                    ? "bg-[#0F5132] text-white border-[#0F5132] shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-white/20 text-[#F5D77F]" : "bg-white text-[#0F5132] shadow-xs"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold truncate leading-snug">{v.category}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isSelected ? "text-emerald-200" : "text-gray-400"
                    }`}
                  >
                    {v.commissionRate}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Vertical Details Card */}
        <div className="bg-gradient-to-br from-[#F8F9F8] to-[#E8F5E9]/30 rounded-2xl p-6 border border-emerald-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center shadow-md">
                <activeVertical.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{activeVertical.title}</h3>
                <span className="text-xs font-bold text-[#0F5132]">
                  {activeVertical.commissionRate}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {activeVertical.description}
            </p>

            {/* Talking Point Pitch */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs text-gray-700 space-y-1">
              <div className="font-extrabold text-[#0F5132] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Recommended Partner Positioning:
              </div>
              <p className="italic text-gray-600 leading-relaxed">"{activeVertical.keyPitch}"</p>
            </div>

            {/* Target Audiences */}
            <div>
              <div className="text-xs font-bold text-gray-800 mb-2">Ideal Partner Profiles:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeVertical.targetAudience.map((target, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-gray-600 bg-white p-2 rounded-xl border border-gray-100 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Metrics & Recommended Programs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Revenue & Commercial Metrics
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Commission Rate:</span>
                  <span className="font-bold text-[#0F5132]">{activeVertical.commissionRate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Average Deal / Ticket:</span>
                  <span className="font-bold text-gray-900">{activeVertical.averageDealSize}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Projected Monthly Yield:</span>
                  <span className="font-extrabold text-amber-700">
                    {activeVertical.projectedEarnings}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-bold text-gray-700 mb-2">
                  Featured Programs in this Vertical:
                </div>
                <div className="space-y-1.5">
                  {activeVertical.recommendedPrograms.map((prog, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2 rounded-lg bg-emerald-50/50 text-[#0F5132] font-medium border border-emerald-100 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <a
                  id="register-partner-vertical-card-cta"
                  href={REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0F5132] hover:bg-[#125838] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Partner in this Vertical</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5D77F]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE EARNINGS SIMULATOR */}
      <div className="bg-gradient-to-br from-[#0F5132] to-[#125838] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F5D77F] text-xs font-extrabold uppercase tracking-wider border border-white/20">
              <Coins className="w-3.5 h-3.5" />
              Interactive Return On Referral Calculator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Estimate Your Monthly Partner Commissions
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto">
              See what your existing audience, patient roster, or community reach translates to in
              direct monthly payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-black/20 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            {/* Sliders */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-emerald-200">Referred Clients per Month:</span>
                  <span className="text-[#F5D77F] text-sm font-black">
                    {monthlyReferrals} Clients
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={monthlyReferrals}
                  onChange={(e) => setMonthlyReferrals(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-emerald-300/70 mt-1">
                  <span>2 clients</span>
                  <span>50 clients</span>
                  <span>100+ clients</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-emerald-200">Average Program / Cohort Value:</span>
                  <span className="text-[#F5D77F] text-sm font-black">
                    ₹{avgTicketPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="1999"
                  max="49999"
                  step="1000"
                  value={avgTicketPrice}
                  onChange={(e) => setAvgTicketPrice(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-emerald-300/70 mt-1">
                  <span>₹1,999 (Workshop)</span>
                  <span>₹15,000 (Cohort)</span>
                  <span>₹50,000 (Corporate)</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-200/80 bg-white/5 p-3 rounded-xl border border-white/10">
                Calculated at standard base partner rate (20%). High-volume partners elevate to Silver
                (25%) and Gold (30%) tiers with additional bonus multipliers.
              </div>
            </div>

            {/* Output Display */}
            <div className="md:col-span-5 bg-white/10 rounded-2xl p-5 border border-[#D4AF37]/30 text-center space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                  Estimated Monthly Earnings
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#F5D77F] mt-1">
                  ₹{estimatedCommission.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-emerald-200 mt-0.5">
                  ₹{(estimatedCommission * 12).toLocaleString("en-IN")} / year recurring
                </div>
              </div>

              <div className="pt-2">
                <a
                  id="register-partner-calc-cta"
                  href={REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#e5be47] hover:from-[#c29e2f] hover:to-[#b59024] text-[#0F5132] text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Register Now & Be Our Partner</span>
                  <ArrowRight className="w-4 h-4 text-[#0F5132]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DIRECT DISBURSAL & PAYOUT INFRASTRUCTURE HIGHLIGHTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
            <Wallet className="w-3.5 h-3.5 text-[#0F5132]" />
            Direct Settlement Infrastructure
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Seamless Payouts Through Razorpay & Direct Banking
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            No convoluted voucher points or redemption hurdles. Genuine monetary compensation
            credited directly to your preferred account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F5132]/10 text-[#0F5132] flex items-center justify-center font-bold">
              ⚡
            </div>
            <h4 className="text-sm font-extrabold text-gray-900">Direct Razorpay ID Settlement</h4>
            <p className="text-xs text-gray-600">
              Provide your Razorpay ID or contact handle for instant sub-minute automated
              disbursals powered by RazorpayX.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F5132]/10 text-[#0F5132] flex items-center justify-center font-bold">
              📱
            </div>
            <h4 className="text-sm font-extrabold text-gray-900">All UPI Handles Supported</h4>
            <p className="text-xs text-gray-600">
              Receive direct bank transfers via Google Pay, PhonePe, Paytm, or any BHIM UPI ID with
              instant WhatsApp alert notifications.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F5132]/10 text-[#0F5132] flex items-center justify-center font-bold">
              🏦
            </div>
            <h4 className="text-sm font-extrabold text-gray-900">NEFT / IMPS Direct Credit</h4>
            <p className="text-xs text-gray-600">
              Link any accredited Indian bank account (HDFC, ICICI, SBI, Axis) with full TDS
              compliance certificates and GST invoicing.
            </p>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM BANNER & FINAL REGISTRATION CTA */}
      <div className="bg-gradient-to-r from-[#0F5132] via-[#146c43] to-[#0F5132] rounded-3xl p-8 sm:p-10 text-white text-center space-y-6 shadow-xl border border-[#D4AF37]/40">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F5D77F] text-xs font-extrabold uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Begin Your Partnership Today
          </div>
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to Empower Your Clients and Multiply Your Impact?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Join hundreds of trusted healthcare, corporate, yoga, and educational leaders across
            India. Registration takes less than 2 minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            id="register-partner-bottom-cta"
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#e5be47] to-[#D4AF37] hover:from-[#c29e2f] hover:to-[#b59024] text-[#0F5132] font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition transform active:scale-98 cursor-pointer border border-amber-300"
          >
            <span>Register Now & Be Our Partner</span>
            <ExternalLink className="w-5 h-5 text-[#0F5132]" />
          </a>
        </div>

        <p className="text-[11px] text-emerald-200/80">
          Official link:{" "}
          <span className="font-mono text-[#F5D77F] font-semibold">{REGISTER_URL}</span>
        </p>
      </div>
    </div>
  );
};
