const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_providers',
        key: 'id',
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
    },
    service_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    service_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    service_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    service_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    platform_commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    provider_earning: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    razorpay_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customer_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customer_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provider_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    provider_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'bookings',
    timestamps: true,
  }
);

module.exports = Booking;
