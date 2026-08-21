import mongoose from 'mongoose';

const demoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    previewImage: {
      type: String,
      required: [true, 'Please add a preview image URL'],
    },
    liveUrl: {
      type: String,
      required: [true, 'Please add a live demo URL'],
    },
    technologies: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    startingPrice: {
      type: Number,
      required: [true, 'Please add a starting price'],
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

const Demo = mongoose.model('Demo', demoSchema);
export default Demo;
