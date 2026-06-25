const bcrypt = require('bcryptjs');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const { providers, services, DEFAULT_PROVIDER_PASSWORD } = require('./seedData');

async function autoSeed() {
  try {
    console.log('🌱 Starting automatic database seeding...');

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

    console.log(`🌱 Auto-seed complete. Providers: ${pCreated} created, ${pUpdated} updated. Services: ${sCreated} created, ${sUpdated} updated.`);
  } catch (err) {
    console.error('✗ Auto-seed failed:', err.message);
  }
}

module.exports = autoSeed;
