import mongoose from 'mongoose';

const types = ['Irrigation Activation', 'Data Submission', 'Seedling Sow', 'Seedling Ready'];
const reservoirLevels = ['OK', 'LOW', 'FULL'];
const waterLevels = ['OK', 'LOW', 'FULL']

const EventSchema = new mongoose.Schema({
    device:{
        type: mongoose.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    eventDate:{
        type: Number,
        required: true,
        default: Date.now()
    },
    eventType:{
        type: String,
        enum: types,
        required: true,
        default: 'Data Submission'
    },
     temperature: {
    type: Number,
    required: true,
    default: 0
  },

  humidity: {
    type: Number,
    required: true,
    default: 0
  },

  // Rain sensor raw value (from raindrop sensor)
  rainSensorValue: {
    type: Number,
    default: 0
  },

  // Derived weather condition
  weatherStatus: {
    type: String,
    enum: ['SUNNY', 'RAINING'],
    default: 'SUNNY'
  },

  // 🌂 UMBRELLA DOCK SYSTEM (RFID-BASED)
  umbrella1: {
    type: Boolean,
    default: true // true = available, false = borrowed
  },
  umbrella2: {
    type: Boolean,
    default: true
  },
  umbrella3: {
    type: Boolean,
    default: true
  },

  // RFID action state
  rfidAction: {
    type: String,
    enum: ['NONE', 'BORROW', 'RETURN'],
    default: 'NONE'
  },

  lastRFIDTag: {
    type: String,
    default: null
  },

  // 🔌 COIN-BASED SMART CHARGING SYSTEM
  coinInserted: {
    type: Boolean,
    default: false
  },

  coinCount: {
    type: Number,
    default: 0
  },

  isCharging: {
    type: Boolean,
    default: false
  },

  // Remaining charging time in minutes
  chargingTimeRemaining: {
    type: Number,
    default: 0
  },

  portAvailable: {
    type: Boolean,
    default: true
  },

  // Phone detection for automatic charging
  phoneDetected: {
    type: Boolean,
    default: false
  }
});

const Event=mongoose.model('Event', EventSchema);

export default Event;