import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a portfolio title'],
    },
    client: {
      type: String,
      required: [true, 'Please add a client name'],
    },
    industry: {
      type: String,
      required: [true, 'Please add an industry type'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail image URL'],
    },
    gallery: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    challenge: {
      type: String,
      required: [true, 'Please add the project challenge details'],
    },
    solution: {
      type: String,
      required: [true, 'Please add the project solution details'],
    },
    features: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    result: {
      type: String,
      required: [true, 'Please add the results achieved'],
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

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
