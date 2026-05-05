/**
 * Test d'envoi réel des 3 emails au gérant via l'API Next.js
 * Usage: node scripts/test-emails.mjs
 *
 * Ce script soumet les 3 formulaires via l'API backend (Laravel)
 * qui déclenche l'envoi d'email via emailService.ts (Resend + React Email)
 */

const NEXT_URL  = "http://localhost:3000";
const API_URL   = "http://127.0.0.1:8000/api";

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

function ok(msg)   { console.log(`  ${GREEN}✔${RESET}  ${msg}`); }
function fail(msg) { console.log(`  ${RED}✘${RESET}  ${msg}`); }
function info(msg) { console.log(`  ${YELLOW}→${RESET}  ${msg}`); }
function warn(msg) { console.log(`  ${YELLOW}⚠${RESET}  ${msg}`); }

/* ─── 1. CONTACT ───────────────────────────────────────────── */
async function testContactEmail() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  📧  EMAIL DE CONTACT → GÉRANT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const payload = {
    name: "Youssef Benali",
    email: "youssef.test@mohadrive.com",
    phone: "+212661234567",
    subject: "Demande d'information - Test Email",
    message: "Bonjour,\n\nJe souhaite avoir plus d'informations sur vos tarifs de location longue durée.\n\nMerci d'avance.",
  };

  info(`Envoi via ${API_URL}/contact`);

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      ok(`API Laravel : HTTP ${res.status} — ${data.message || "OK"}`);
      ok(`Email styled (StyledContactEmail) déclenché vers le gérant`);
    } else {
      fail(`API Laravel : HTTP ${res.status} — ${data.message || JSON.stringify(data)}`);
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`);
    warn(`Vérifiez que le serveur Laravel tourne sur http://127.0.0.1:8000`);
    return false;
  }
}

/* ─── 2. AVIS ───────────────────────────────────────────────── */
async function testReviewEmail() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ⭐  EMAIL D'AVIS → GÉRANT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const payload = {
    name: "Fatima Zahra",
    email: "fatima.test@mohadrive.com",
    role: "Cliente fidèle",
    rating: 5,
    content: "Excellente expérience ! La voiture était impeccable, propre et en parfait état. La livraison était ponctuelle et le personnel très professionnel. Je recommande MohaDrive sans hésitation !",
  };

  info(`Envoi via ${API_URL}/reviews`);

  try {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      ok(`API Laravel : HTTP ${res.status} — ${data.message || "OK"}`);
      ok(`Email styled (StyledReviewEmail) déclenché vers le gérant`);
    } else {
      fail(`API Laravel : HTTP ${res.status} — ${data.message || JSON.stringify(data)}`);
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`);
    return false;
  }
}

/* ─── 3. RÉSERVATION ────────────────────────────────────────── */
async function testBookingEmail() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  🚗  EMAIL DE RÉSERVATION → GÉRANT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  // Récupérer une voiture
  let car = null;
  info(`Récupération d'une voiture disponible...`);
  try {
    const res = await fetch(`${API_URL}/cars`, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const body = await res.json();
      const cars = body.data || body;
      if (Array.isArray(cars) && cars.length > 0) {
        car = cars[0];
        ok(`Voiture : ${car.brand} ${car.model} (ID=${car.id})`);
      } else {
        fail("Aucune voiture trouvée"); return false;
      }
    } else {
      fail(`Impossible de récupérer les voitures (HTTP ${res.status})`); return false;
    }
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`); return false;
  }

  const startD = new Date(); startD.setDate(startD.getDate() + 30);
  const endD   = new Date(); endD.setDate(endD.getDate() + 32);
  const start  = `${startD.toISOString().split("T")[0]} 10:00:00`;
  const end    = `${endD.toISOString().split("T")[0]} 10:00:00`;

  const payload = {
    car_id:          car.id,
    first_name:      "Karim",
    last_name:       "Alaoui",
    email:           "karim.test@mohadrive.com",
    phone:           "+212677890123",
    start_date:      start,
    end_date:        end,
    location:        "El Aïoun Sidi Mellouk — Aéroport Oujda",
    return_location: "El Aïoun Sidi Mellouk",
    daily_price:     car.price_per_day || car.pricePerDay || 300,
    total_price:     (car.price_per_day || car.pricePerDay || 300) * 2,
    status:          "PENDING",
  };

  info(`Envoi via ${API_URL}/bookings`);

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    const booking = data.data || data;

    if (res.ok) {
      ok(`API Laravel : HTTP ${res.status} — Réservation #${booking.id || "?"} créée`);
      ok(`Email styled (StyledAdminBookingEmail) déclenché vers le gérant`);
    } else {
      fail(`API Laravel : HTTP ${res.status} — ${data.message || JSON.stringify(data)}`);
      if (data.errors) Object.entries(data.errors).forEach(([f, m]) => fail(`  "${f}": ${m}`));
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`); return false;
  }
}

/* ─── RÉSUMÉ ─────────────────────────────────────────────────── */
async function run() {
  console.log(`\n${BOLD}${"═".repeat(42)}`);
  console.log(`  MOHADRIVE — TEST D'ENVOI DES 3 EMAILS`);
  console.log(`${"═".repeat(42)}${RESET}`);
  console.log(`  Next.js  : ${NEXT_URL}`);
  console.log(`  Laravel  : ${API_URL}`);

  const r = {
    contact:     await testContactEmail(),
    avis:        await testReviewEmail(),
    reservation: await testBookingEmail(),
  };

  const passed = Object.values(r).filter(Boolean).length;
  const total  = Object.keys(r).length;

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  RÉSUMÉ`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  📧 Contact     : ${r.contact     ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`  ⭐ Avis        : ${r.avis        ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`  🚗 Réservation : ${r.reservation ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`\n  ${passed}/${total} emails déclenchés avec succès`);

  if (passed === total) {
    console.log(`\n${GREEN}${BOLD}  ✓ Tous les emails ont été envoyés au gérant (${RESET}sbbrhaythamcreetou@gmail.com${GREEN}${BOLD})${RESET}`);
    console.log(`  ${YELLOW}→${RESET}  Si RESEND_API_KEY est configurée : emails réels reçus`);
    console.log(`  ${YELLOW}→${RESET}  Sinon : logs MOCK visibles dans la console Next.js\n`);
  }

  process.exit(passed === total ? 0 : 1);
}

run();
