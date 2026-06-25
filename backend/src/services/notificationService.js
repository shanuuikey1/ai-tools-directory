const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const ServiceProvider = require('../models/ServiceProvider');
const axios = require('axios');

/**
 * Service to handle sending automated notifications to WhatsApp groups
 * and other notification channels.
 */
exports.sendBookingNotification = async (bookingId) => {
  try {
    // Fetch the booking with all associations
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: User },
        { model: Service },
        { model: ServiceProvider },
      ],
    });

    if (!booking) {
      console.error(`[NotificationService] Booking #${bookingId} not found`);
      return;
    }

    const customerName = `${booking.User?.first_name || ''} ${booking.User?.last_name || ''}`.trim() || 'Guest';
    const serviceName = booking.Service?.name || 'Home Service';
    const providerName = booking.ServiceProvider?.name || 'Unassigned';
    const date = new Date(booking.service_date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    // Truncate seconds from time if present (e.g., "10:00:00" -> "10:00")
    const time = booking.service_time ? booking.service_time.substring(0, 5) : 'N/A';
    const price = booking.service_price;
    const address = booking.service_address;

    // Formatted WhatsApp message using markdown styling
    const message = `🔔 *New Booking Confirmed!*\n\n` +
      `• *Booking ID:* #${booking.id}\n` +
      `• *Service:* ${serviceName}\n` +
      `• *Date:* ${date}\n` +
      `• *Time:* ${time}\n` +
      `• *Price:* ₹${price}\n` +
      `• *Customer:* ${customerName} (${booking.User?.phone || 'N/A'})\n` +
      `• *Address:* ${address}\n` +
      `• *Provider:* ${providerName}\n\n` +
      `👉 _Manage this booking in the Admin Dashboard._`;

    const mode = process.env.WHATSAPP_NOTIFICATION_MODE || 'console';

    if (mode === 'live') {
      const url = process.env.WHATSAPP_API_URL || 'https://api.green-api.com';
      const instanceId = process.env.WHATSAPP_INSTANCE_ID;
      const token = process.env.WHATSAPP_API_TOKEN;
      const groupId = process.env.WHATSAPP_GROUP_ID;

      if (!instanceId || !token || !groupId) {
        console.warn('⚠️ WhatsApp live notification credentials missing in environment variables. Falling back to console.');
        logToConsole(message);
        return;
      }

      // Green API sendMessage endpoint
      // POST {{apiUrl}}/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}
      const endpoint = `${url.replace(/\/$/, '')}/waInstance${instanceId}/sendMessage/${token}`;
      
      await axios.post(endpoint, {
        chatId: groupId,
        message: message,
      });

      console.log(`✓ WhatsApp group notification sent for Booking #${booking.id}`);
    } else {
      logToConsole(message);
    }
  } catch (error) {
    console.error('❌ Failed to send booking notification:', error.message || error);
  }
};

function logToConsole(message) {
  console.log('\n--- [WHATSAPP MOCK NOTIFICATION] ---');
  console.log(message);
  console.log('-------------------------------------\n');
}
