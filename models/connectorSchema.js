/* eslint-disable max-len */
const mongoose = require('mongoose');

const connectorSchema = new mongoose.Schema({
  connectorId: {type: String, unique: true, required: true},
  type: {type: String, required: true},
  connectorPowerInKiloWatt: {type: Number, default: '10'}, // Default value set to 10KW
  manufacturer: String,
  status: {type: String, required: true},
  chargePointId: {type: String, required: true},
  chargeStationName: {type: String, required: true},
  address: {city: String, pincode: Number},
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
connectorSchema.index({location: '2dsphere'});
// Pre-save middleware function to validate fields
connectorSchema.pre('save', async function(next) {
  const doc = this;
  // Custom validation to check uniqueness of connectorId
  const existingConnector = await mongoose.models.Connector.findOne({connectorId: doc.connectorId});
  if (existingConnector) {
    return next(new Error('Connector ID must be unique'));
  }

  next();
});

module.exports = mongoose.model('Connector', connectorSchema);
