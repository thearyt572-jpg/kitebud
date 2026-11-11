/* KITE — site settings. Change these, not the page code.
   SHOWCASE_FREE: true = showcase mode. Every student's full report is free, all price buttons become
   "Showcase: full report free", and the checkout page only says payment is coming soon.
   Set to false to bring back the packages and the (test) checkout.
   SUPABASE_URL / SUPABASE_KEY: where js/db.js saves answers (only after the student chose Allow).
   The key is the PUBLISHABLE key: it is meant to be public, and Row Level Security only lets it INSERT.
   NEVER put the secret (service_role) key here. Leave both empty to switch saving off.
   PAYMENT_ENABLED: true = a student must pay 3,000៛ by ABA KHQR (checked by staff in staff.html) before the
   test, and only that paid session unlocks the report (SHOWCASE_FREE is then ignored for unlocking).
   false = no payment at all, exactly as before. The other PAYMENT_ / KHQR_ / _MINUTES / _HOURS values are
   for display only: the database decides the real amount and times. */
window.KITE_CONFIG = {
  SHOWCASE_FREE: true,
  PAYMENT_ENABLED: true,
  PAYMENT_AMOUNT: 3000,
  PAYMENT_DISPLAY_USD: "0.75",   // the fixed ABA KHQR is in USD: staff treat 0.75 USD as the 3,000៛ price (display only)
  PAYMENT_CURRENCY: "KHR",
  KHQR_IMAGE: "images/aba-khqr-3000.jpg",
  PENDING_MINUTES: 20,
  SESSION_HOURS: 2,
  ISTAND_IDLE_SECONDS: 240,        // i-Stand mode: no touch or key press for 4 minutes -> "Are you still there?"
  ISTAND_COUNTDOWN_SECONDS: 30,    // then 30 seconds to press Continue, or the screen is cleared for the next student
  ISTAND_WAITING_IDLE_SECONDS: 600, // on pay.html while a request waits for staff (pending, or expired and still checked): 10 minutes
  SUPABASE_URL: "https://gvfjaojjkeunheifptja.supabase.co",
  SUPABASE_KEY: "sb_publishable_sfMVvabL04lWhnkqLImaKg_ZejMQvbE"
};

/* TEST DATABASE switch (payment development). Used ONLY when the site is opened on localhost, 127.0.0.1 or a
   private network address (10.x.x.x, 192.168.x.x, 172.16-31.x.x: phones and the i-Stand on the same Wi-Fi);
   on every other host (thekitebud.com, previews, Netlify) the production values above are used unchanged.
   Paste the TEST Supabase project's URL and PUBLISHABLE key here (public values; never the service_role key).
   If they are left empty, localhost saves nothing at all: it never falls back to the production database.
   A red "TEST DATABASE" badge is shown on every page while the switch is on.
   TEST_PAYMENT_ENABLED: true switches payment on, but ONLY on those test addresses (never online). */
window.KITE_CONFIG.TEST_SUPABASE_URL = "https://okjipgphulecowlvejrn.supabase.co";   // https://<test-project-ref>.supabase.co
window.KITE_CONFIG.TEST_SUPABASE_KEY = "sb_publishable_TB4rn9C3id1FBeaK3mDm_w_7YUi0KY9";   // sb_publishable_… of the TEST project
window.KITE_CONFIG.TEST_PAYMENT_ENABLED = true;
(function (C) {
  var h = location.hostname;
  // the whole hostname must be the address itself (anchored), so a name like 10.0.0.1.example.com never matches
  var lan = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})$/.test(h);
  if (h !== "localhost" && h !== "127.0.0.1" && !lan) return;
  C.TEST_DATABASE = true;
  C.SUPABASE_URL = C.TEST_SUPABASE_URL || "";
  C.SUPABASE_KEY = C.TEST_SUPABASE_KEY || "";
  C.PAYMENT_ENABLED = !!C.TEST_PAYMENT_ENABLED;
  function badge() {
    if (document.getElementById("kite-test-db")) return;
    var b = document.createElement("div");
    b.id = "kite-test-db"; b.setAttribute("role", "status");
    b.textContent = C.SUPABASE_URL ? "TEST DATABASE" : "TEST DATABASE · not set, nothing is saved";
    b.style.cssText = "position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:2147483647;pointer-events:none;" +
      "background:#B53A33;color:#fff;font:700 12px/1.3 system-ui,sans-serif;letter-spacing:.08em;padding:6px 14px;" +
      "border-radius:0 0 10px 10px;box-shadow:0 2px 6px rgba(0,0,0,.25);white-space:nowrap";
    document.body.appendChild(b);
  }
  if (document.body) badge(); else document.addEventListener("DOMContentLoaded", badge);
})(window.KITE_CONFIG);
