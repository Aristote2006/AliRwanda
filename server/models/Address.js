import mongoose from 'mongoose';

const addressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    label: {
      type: String,
      required: true,
      enum: ['Home', 'Work', 'University', 'Other'],
      default: 'Home',
    },
    customLabel: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      required: true,
      default: 'Rwanda',
    },
    district: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    cell: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Address', addressSchema);
