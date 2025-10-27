import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Hair', 'Makeup', 'Facial', 'Manicure & Pedicure', 'Body Treatments', 'Bridal', 'Waxing', 'Other', ''],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;