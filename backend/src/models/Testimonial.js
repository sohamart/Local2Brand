import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    testimonial: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    business: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
