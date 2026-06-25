const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { encrypt, decrypt } = require('../utils/crypto');

const ServiceProvider = sequelize.define(
  'ServiceProvider',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    service_categories: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0,
    },
    total_services: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Sensitive financial / identity data — encrypted at rest with
    // AES-256-GCM via transparent setters/getters (see utils/crypto). Stored
    // as ciphertext strings; reads return the decrypted value automatically.
    // These must never be returned in list endpoints (see adminController).
    bank_account: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue('bank_account', encrypt(value));
      },
      get() {
        return decrypt(this.getDataValue('bank_account'));
      },
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue('ifsc_code', encrypt(value));
      },
      get() {
        return decrypt(this.getDataValue('ifsc_code'));
      },
    },
    aadhar_number: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue('aadhar_number', encrypt(value));
      },
      get() {
        return decrypt(this.getDataValue('aadhar_number'));
      },
    },
    verification_status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'service_providers',
    timestamps: true,
  }
);

module.exports = ServiceProvider;
