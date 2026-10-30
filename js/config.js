/* KITE — site settings. Change these, not the page code.
   SHOWCASE_FREE: true = showcase mode. Every student's full report is free, all price buttons become
   "Showcase: full report free", and the checkout page only says payment is coming soon.
   Set to false to bring back the packages and the (test) checkout.
   SUPABASE_URL / SUPABASE_KEY: where js/db.js saves answers (only after the student chose Allow).
   The key is the PUBLISHABLE key: it is meant to be public, and Row Level Security only lets it INSERT.
   NEVER put the secret (service_role) key here. Leave both empty to switch saving off. */
window.KITE_CONFIG = {
  SHOWCASE_FREE: true,
  SUPABASE_URL: "https://gvfjaojjkeunheifptja.supabase.co",
  SUPABASE_KEY: "sb_publishable_sfMVvabL04lWhnkqLImaKg_ZejMQvbE"
};
