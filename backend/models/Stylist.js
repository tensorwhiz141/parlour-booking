import mongoose from 'mongoose';

const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stylist name is required'],
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    image: {
      type: String,
      default: '',
    },
    availability: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Stylist = mongoose.model('Stylist', stylistSchema);

export default Stylist;