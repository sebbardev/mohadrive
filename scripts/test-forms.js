/**
 * Test des 3 formulaires clients : Réservation, Avis, Contact
 * Usage: node scripts/test-forms.js
 */

const API_URL = "http://127.0.0.1:8000/api";

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

function ok(msg)   { console.log(`  ${GREEN}✔${RESET} ${msg}`); }
function fail(msg) { console.log(`  ${RED}✘${RESET} ${msg}`); }
function info(msg) { console.log(`  ${YELLOW}→${RESET} ${msg}`); }

async function testContact() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  📧  FORMULAIRE DE CONTACT`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const payload = {
    name: "Test Client",
    email: "test@mohadrive.ma",
    phone: "+212600000001",
    subject: "Test automatique",
    message: "Ceci est un message de test envoyé automatiquement pour vérifier le formulaire de contact.",
  };

  info(`POST ${API_URL}/contact`);
  info(`Données : ${JSON.stringify(payload, null, 0)}`);

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      ok(`Statut HTTP : ${res.status}`);
      ok(`Réponse : ${data.message || JSON.stringify(data)}`);
    } else {
      fail(`Statut HTTP : ${res.status}`);
      fail(`Erreur : ${data.message || JSON.stringify(data)}`);
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`);
    return false;
  }
}

async function testReview() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ⭐  FORMULAIRE D'AVIS`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const payload = {
    name: "Test Client Avis",
    email: "avis@mohadrive.ma",
    role: "Client Test",
    rating: 5,
    content: "Service exceptionnel ! Voiture impeccable et livraison à l'heure. Je recommande vivement MohaDrive.",
  };

  info(`POST ${API_URL}/reviews`);
  info(`Données : ${JSON.stringify(payload, null, 0)}`);

  try {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      ok(`Statut HTTP : ${res.status}`);
      ok(`Réponse : ${data.message || JSON.stringify(data)}`);
    } else {
      fail(`Statut HTTP : ${res.status}`);
      fail(`Erreur : ${data.message || JSON.stringify(data)}`);
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`);
    return false;
  }
}

async function testBooking() {
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  🚗  FORMULAIRE DE RÉSERVATION`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  // D'abord récupérer l'ID de la première voiture disponible
  let carId = null;
  info(`Récupération des voitures disponibles...`);
  try {
    const carsRes = await fetch(`${API_URL}/cars`, {
      headers: { "Accept": "application/json" },
    });
    if (carsRes.ok) {
      const carsData = await carsRes.json();
      const cars = carsData.data || carsData;
      if (Array.isArray(cars) && cars.length > 0) {
        carId = cars[0].id;
        ok(`Voiture trouvée : ID=${carId} (${cars[0].brand || ""} ${cars[0].model || ""})`);
      } else {
        fail("Aucune voiture disponible dans l'API");
        return false;
      }
    } else {
      fail(`Impossible de récupérer les voitures (HTTP ${carsRes.status})`);
      return false;
    }
  } catch (e) {
    fail(`Erreur réseau lors de la récupération des voitures : ${e.message}`);
    return false;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startDate = `${today.toISOString().split("T")[0]} 10:00:00`;
  const endDate   = `${tomorrow.toISOString().split("T")[0]} 10:00:00`;

  const payload = {
    car_id: carId,
    first_name: "Test",
    last_name: "Réservation",
    email: "reservation@mohadrive.ma",
    phone: "+212600000002",
    start_date: startDate,
    end_date: endDate,
    location: "El Aïoun Sidi Mellouk",
    return_location: "El Aïoun Sidi Mellouk",
    daily_price: 300,
    total_price: 300,
    status: "PENDING",
  };

  info(`POST ${API_URL}/bookings`);
  info(`Données : ${JSON.stringify(payload, null, 0)}`);

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      ok(`Statut HTTP : ${res.status}`);
      const booking = data.data || data;
      ok(`Réservation créée : ID=${booking.id || "?"}, Statut=${booking.status || "?"}`);
    } else {
      fail(`Statut HTTP : ${res.status}`);
      fail(`Erreur : ${data.message || JSON.stringify(data)}`);
      if (data.errors) {
        Object.entries(data.errors).forEach(([field, msgs]) => {
          fail(`  Champ "${field}" : ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`);
        });
      }
    }
    return res.ok;
  } catch (e) {
    fail(`Erreur réseau : ${e.message}`);
    return false;
  }
}

async function run() {
  console.log(`\n${BOLD}${"═".repeat(42)}`);
  console.log(`  MOHADRIVE — TEST DES 3 FORMULAIRES CLIENTS`);
  console.log(`${"═".repeat(42)}${RESET}`);
  console.log(`  API : ${API_URL}`);

  const results = {
    contact:     await testContact(),
    avis:        await testReview(),
    reservation: await testBooking(),
  };

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  RÉSUMÉ`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);

  const total  = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;

  console.log(`  Contact     : ${results.contact     ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`  Avis        : ${results.avis        ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`  Réservation : ${results.reservation ? `${GREEN}✔ OK${RESET}` : `${RED}✘ ÉCHEC${RESET}`}`);
  console.log(`\n  ${passed}/${total} formulaires fonctionnels\n`);

  process.exit(passed === total ? 0 : 1);
}

run();
