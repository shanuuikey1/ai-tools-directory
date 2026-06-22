// Idempotent seeder: loads workers + services from seedData.js into the
// database. Safe to re-run — matches providers by email and services by
// (name + category), updating instead of duplicating.
//
// Usage (from backend/):  npm run seed
// Uses the same DATABASE_URL / DB_* config as the app.

const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const { providers, services, DEFAULT_PROVIDER_PASSWORD } = require('./seedData');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database');

    // Ensure tables exist (no-op if the app already created them).
    await sequelize.sync();

    const passwordHash = await bcrypt.hash(DEFAULT_PROVIDER_PASSWORD, 10);

    let pCreated = 0;
    let pUpdated = 0;
    for (const p of providers) {
      const [row, created] = await ServiceProvider.findOrCreate({
        where: { email: p.email },
        defaults: { ...p, password_hash: passwordHash },
      });
      if (created) {
        pCreated++;
      } else {
        // Update editable fields but never reset an existing password.
        await row.update({
          name: p.name,
          phone: p.phone,
          bio: p.bio,
          city: p.city,
          pincode: p.pincode,
          service_categories: p.service_categories,
          bank_account: p.bank_account,
          ifsc_code: p.ifsc_code,
          verification_status: p.verification_status,
        });
        pUpdated++;
      }
    }

    let sCreated = 0;
    let sUpdated = 0;
    for (const s of services) {
      const [row, created] = await Service.findOrCreate({
        where: { name: s.name, category: s.category },
        defaults: s,
      });
      if (created) {
        sCreated++;
      } else {
        await row.update({
          description: s.description,
          base_price: s.base_price,
          is_active: true,
        });
        sUpdated++;
      }
    }

    console.log(
      `✓ Providers: ${pCreated} created, ${pUpdated} updated`
    );
    console.log(`✓ Services:  ${sCreated} created, ${sUpdated} updated`);
    console.log(
      `\nWorkers can log in with their email and password "${DEFAULT_PROVIDER_PASSWORD}".`
    );
    console.log('Tell them to change it after first login.');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
