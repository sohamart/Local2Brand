import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { _id: false });

const ConditionSchema = new mongoose.Schema({
  field: { type: String, required: true }, // e.g. 'websiteType' or questionId
  operator: { type: String, enum: ['equals', 'not_equals', 'contains', 'in', 'is_true', 'is_false'], default: 'equals' },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  action: { type: String, enum: ['show', 'hide', 'require', 'optional'], default: 'show' }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  stepId: { type: String, required: true },
  categoryId: { type: String, default: 'all' }, // 'all' or specific website type e.g. 'restaurant'
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: [
      'text',
      'textarea',
      'number',
      'email',
      'phone',
      'url',
      'date',
      'time',
      'select',
      'multi_select',
      'radio',
      'checkbox',
      'toggle',
      'yes_no',
      'file',
      'image',
      'multi_url'
    ],
    default: 'text'
  },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  options: [OptionSchema],
  conditions: [ConditionSchema], // Conditional logic rules
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  validation: {
    minLength: { type: Number },
    maxLength: { type: Number },
    min: { type: Number },
    max: { type: Number },
    fileTypes: [{ type: String }],
    maxFileSizeMb: { type: Number, default: 10 }
  }
}, { _id: false });

const StepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'Layers' },
  enabled: { type: Boolean, default: true },
  isConditional: { type: Boolean, default: false },
  conditions: [ConditionSchema],
  order: { type: Number, default: 0 }
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: 'Globe' },
  badge: { type: String, default: '' },
  description: { type: String, default: '' },
  popular: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const FormConfigSchema = new mongoose.Schema({
  name: { type: String, default: 'Client Website Requirement Form' },
  version: { type: String, default: '1.0' },
  versionNumber: { type: Number, default: 1 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  isPublished: { type: Boolean, default: true },
  categories: [CategorySchema],
  steps: [StepSchema],
  questions: [QuestionSchema],
  publishedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.FormConfig || mongoose.model('FormConfig', FormConfigSchema);
