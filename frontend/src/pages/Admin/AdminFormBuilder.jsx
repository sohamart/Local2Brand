import React, { useState, useEffect, Component } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Check,
  X,
  Copy,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Tag,
  Shield,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AshokaChakra from '../../components/common/AshokaChakra';

// Robust Error Boundary wrapper
class FormBuilderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FormBuilder Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center space-y-4 bg-red-50/50 dark:bg-red-950/40 rounded-3xl border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Form Builder Error Caught</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {this.state.error?.message || 'An error occurred while rendering the dynamic questions editor.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-5 py-2 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer"
          >
            Reload Form Builder
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminFormBuilderContent() {
  const [activeForm, setActiveForm] = useState(null);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'categories' | 'steps' | 'preview'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [notification, setNotification] = useState('');

  // Question Filter & Modal State
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState('all');
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionEditing, setQuestionEditing] = useState(null);
  const [qTitle, setQTitle] = useState('');
  const [qLabel, setQLabel] = useState('');
  const [qDefaultValue, setQDefaultValue] = useState('');
  const [qStepId, setQStepId] = useState('step_business');
  const [qCategoryId, setQCategoryId] = useState('all');
  const [qType, setQType] = useState('text');
  const [qPlaceholder, setQPlaceholder] = useState('');
  const [qDescription, setQDescription] = useState('');
  const [qOptions, setQOptions] = useState('');
  const [qRequired, setQRequired] = useState(false);
  const [qEnabled, setQEnabled] = useState(true);
  const [qOrder, setQOrder] = useState(1);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [catEditing, setCatEditing] = useState(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Globe');
  const [catBadge, setCatBadge] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Step Modal State
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [stepEditing, setStepEditing] = useState(null);
  const [stepTitle, setStepTitle] = useState('');
  const [stepSubtitle, setStepSubtitle] = useState('');

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/forms/published');
      if (res.success && res.form) {
        setActiveForm(res.form);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveForm = async () => {
    if (!activeForm) return;
    setSaving(true);
    try {
      const res = await api.put(`/forms/admin/${activeForm._id}`, activeForm);
      if (res.success) {
        setActiveForm(res.form);
        toast.success('Form schema saved successfully! 💾');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!activeForm) return;
    setSaving(true);
    try {
      const res = await api.post(`/forms/admin/${activeForm._id}/publish`);
      if (res.success) {
        setActiveForm(res.form);
        toast.success('Form Version Published Live to All Clients! 🚀');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish form');
    } finally {
      setSaving(false);
    }
  };

  // --- QUESTION OPERATIONS ---
  const handleOpenAddQuestion = () => {
    setQuestionEditing(null);
    setQTitle('');
    setQLabel('');
    setQDefaultValue('');
    setQStepId('step_business');
    setQCategoryId(questionCategoryFilter === 'all' ? 'all' : questionCategoryFilter);
    setQType('text');
    setQPlaceholder('');
    setQDescription('');
    setQOptions('');
    setQRequired(false);
    setQEnabled(true);
    setQOrder((activeForm?.questions?.length || 0) + 1);
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setQuestionEditing(q);
    setQTitle(typeof q.title === 'string' ? q.title : '');
    setQLabel(typeof q.label === 'string' ? q.label : (typeof q.inputLabel === 'string' ? q.inputLabel : ''));
    setQDefaultValue(typeof q.defaultValue === 'string' ? q.defaultValue : (typeof q.defaultSelected === 'string' ? q.defaultSelected : ''));
    setQStepId(typeof q.stepId === 'string' ? q.stepId : 'step_business');
    setQCategoryId(typeof q.categoryId === 'string' ? q.categoryId : 'all');
    setQType(typeof q.type === 'string' ? q.type : 'text');
    setQPlaceholder(typeof q.placeholder === 'string' ? q.placeholder : '');
    setQDescription(typeof q.description === 'string' ? q.description : (typeof q.helperText === 'string' ? q.helperText : ''));
    setQOptions(Array.isArray(q.options) ? q.options.map(o => typeof o === 'object' ? (o.label || o.value || o.name) : String(o)).join(', ') : (typeof q.options === 'string' ? q.options : ''));
    setQRequired(Boolean(q.required));
    setQEnabled(q.enabled !== false);
    setQOrder(Number(q.order || 1));
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!qTitle.trim()) {
      toast.error('Please provide question title');
      return;
    }

    const rawOptions = ['select', 'multiselect', 'radio', 'checkbox', 'multi_select'].includes(qType)
      ? qOptions.split(',').map((o) => o.trim()).filter(Boolean)
      : [];

    const optionsArray = rawOptions.map((opt, idx) => ({
      id: `opt_${idx + 1}`,
      label: opt,
      value: opt,
      order: idx + 1
    }));

    const newQuestion = {
      id: questionEditing ? String(questionEditing.id) : `q_${Date.now()}`,
      title: String(qTitle),
      label: String(qLabel || qTitle),
      inputLabel: String(qLabel || qTitle),
      defaultValue: String(qDefaultValue || ''),
      defaultSelected: String(qDefaultValue || ''),
      stepId: String(qStepId),
      categoryId: String(qCategoryId),
      type: String(qType),
      placeholder: String(qPlaceholder || ''),
      description: String(qDescription || ''),
      helperText: String(qDescription || ''),
      options: optionsArray,
      required: Boolean(qRequired),
      enabled: Boolean(qEnabled),
      order: Number(qOrder || (questionEditing ? questionEditing.order : (activeForm?.questions?.length || 0) + 1))
    };

    let updatedQuestions = activeForm?.questions || [];
    if (questionEditing) {
      updatedQuestions = updatedQuestions.map((q) => (q.id === questionEditing.id ? newQuestion : q));
    } else {
      updatedQuestions = [...updatedQuestions, newQuestion];
    }

    updatedQuestions.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    setActiveForm({ ...activeForm, questions: updatedQuestions });
    setQuestionModalOpen(false);
    toast.success(`Question "${qTitle}" saved to draft!`);
  };

  const handleDeleteQuestion = (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setActiveForm({
      ...activeForm,
      questions: (activeForm.questions || []).filter((q) => String(q.id) !== String(qId))
    });
    toast.info('Question removed from draft.');
  };

  // --- CATEGORY OPERATIONS ---
  const handleOpenAddCategory = () => {
    setCatEditing(null);
    setCatName('');
    setCatIcon('Globe');
    setCatBadge('New');
    setCatDesc('');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!catName.trim()) return;
    const catId = catEditing ? String(catEditing.id) : catName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCat = {
      id: catId,
      name: String(catName),
      icon: String(catIcon),
      badge: String(catBadge || ''),
      description: String(catDesc || ''),
      enabled: true,
      popular: false,
      order: (activeForm?.categories?.length || 0) + 1
    };

    let updatedCats;
    if (catEditing) {
      updatedCats = activeForm.categories.map((c) => (c.id === catEditing.id ? { ...c, ...newCat } : c));
    } else {
      updatedCats = [...(activeForm?.categories || []), newCat];
    }

    setActiveForm({ ...activeForm, categories: updatedCats });
    setCategoryModalOpen(false);
    showNotification(`Category "${catName}" added!`);
  };

  const handleDeleteCategory = (catId) => {
    if (confirm('Delete this category?')) {
      setActiveForm({
        ...activeForm,
        categories: (activeForm?.categories || []).filter((c) => String(c.id) !== String(catId))
      });
    }
  };

  // --- STEP OPERATIONS ---
  const handleOpenAddStep = () => {
    setStepEditing(null);
    setStepTitle('');
    setStepSubtitle('');
    setStepModalOpen(true);
  };

  const handleSaveStep = () => {
    if (!stepTitle.trim()) return;
    const stepId = stepEditing ? String(stepEditing.id) : `step_${Date.now()}`;
    const newStep = {
      id: stepId,
      stepNumber: (activeForm?.steps?.length || 0) + 1,
      title: String(stepTitle),
      subtitle: String(stepSubtitle || ''),
      icon: 'Layers',
      enabled: true,
      order: (activeForm?.steps?.length || 0) + 1
    };

    let updatedSteps;
    if (stepEditing) {
      updatedSteps = activeForm.steps.map((s) => (s.id === stepEditing.id ? { ...s, ...newStep } : s));
    } else {
      updatedSteps = [...(activeForm?.steps || []), newStep];
    }

    setActiveForm({ ...activeForm, steps: updatedSteps });
    setStepModalOpen(false);
    showNotification(`Step "${stepTitle}" added!`);
  };

  const handleDeleteStep = (stepId) => {
    if (confirm('Delete this step?')) {
      setActiveForm({
        ...activeForm,
        steps: (activeForm?.steps || []).filter((s) => String(s.id) !== String(stepId))
      });
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold">Loading Dynamic Form Builder...</p>
      </div>
    );
  }

  if (!activeForm) {
    return (
      <div className="p-8 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Form Schema Initializing</h3>
        <p className="text-xs text-slate-500">Connecting to form engine...</p>
        <button
          onClick={fetchForms}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const filteredQuestions = (activeForm.questions || []).filter((q) => {
    if (questionCategoryFilter === 'all') return true;
    return String(q.categoryId) === String(questionCategoryFilter) || String(q.categoryId) === 'all';
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <AshokaChakra size={11} />
            <span>Dynamic Form Engine • v{String(activeForm.version || '1.0')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dynamic Form & Question Builder
          </h1>
          <p className="text-xs text-slate-500">
            Visually manage dynamic questions, field types, category-specific questionnaires, steps, and options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveForm}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-purple-600" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublishLive}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{String(notification)}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'questions', label: `Dynamic Questions (${activeForm.questions?.length || 0})` },
          { id: 'categories', label: `Website Categories (${activeForm.categories?.length || 0})` },
          { id: 'steps', label: `Onboarding Steps (${activeForm.steps?.length || 0})` },
          { id: 'preview', label: 'Live Device Preview' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DYNAMIC QUESTIONS BUILDER */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          
          {/* Filter Bar & Add Question Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Website Category:</span>
              <select
                value={questionCategoryFilter}
                onChange={(e) => setQuestionCategoryFilter(e.target.value)}
                className="p-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="all">All Categories (Global & Specific)</option>
                {activeForm.categories?.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Question</span>
            </button>
          </div>

          {/* Questions Grid */}
          <div className="space-y-2.5">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No questions found for this category filter. Click "Add Custom Question" above.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={String(q.id || idx)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-purple-400/60 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                          {typeof q.title === 'string' ? q.title : String(q.title || '')}
                        </h4>
                        <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {typeof q.type === 'string' ? q.type : 'text'}
                        </span>
                        {q.required && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            Required *
                          </span>
                        )}
                        {q.enabled === false ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            Disabled
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Active
                          </span>
                        )}
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Category: {q.categoryId === 'all' ? 'All (Global)' : String(q.categoryId || 'Custom')}
                        </span>
                      </div>

                      {(q.label || q.inputLabel) && (
                        <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                          🏷️ Input Box Label: <strong>"{q.label || q.inputLabel}"</strong>
                        </p>
                      )}

                      {(q.defaultValue || q.defaultSelected) && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                          ⚡ Default Selected: <strong>"{q.defaultValue || q.defaultSelected}"</strong>
                        </p>
                      )}

                      {q.placeholder && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Placeholder: "{typeof q.placeholder === 'string' ? q.placeholder : ''}"
                        </p>
                      )}
                      {Array.isArray(q.options) && q.options.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          <span className="text-[10px] text-slate-400">Options:</span>
                          {q.options.slice(0, 4).map((opt, optIdx) => (
                            <span key={optIdx} className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                              {typeof opt === 'string' ? opt : (opt?.label || opt?.value || String(opt))}
                            </span>
                          ))}
                          {q.options.length > 4 && (
                            <span className="text-[10px] text-slate-400">+{q.options.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-2 rounded-xl text-slate-600 hover:text-purple-600 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/60 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: WEBSITE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Manage Client Website Types
            </span>
            <button
              onClick={handleOpenAddCategory}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeForm.categories?.map((cat) => (
              <div
                key={String(cat.id)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {typeof cat.name === 'string' ? cat.name : String(cat.name || '')}
                  </span>
                  {cat.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {typeof cat.badge === 'string' ? cat.badge : String(cat.badge)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {typeof cat.description === 'string' ? cat.description : 'No description'}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-mono text-[10px] text-purple-600">{String(cat.id)}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STEPS */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Manage Onboarding Wizard Steps
            </span>
            <button
              onClick={handleOpenAddStep}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Step</span>
            </button>
          </div>

          <div className="space-y-2">
            {activeForm.steps?.map((st, idx) => (
              <div
                key={String(st.id || idx)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {typeof st.title === 'string' ? st.title : String(st.title || '')}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {typeof st.subtitle === 'string' ? st.subtitle : 'Step section'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{String(st.id)}</span>
                  <button
                    onClick={() => handleDeleteStep(st.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Interactive Form Preview
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold ${previewDevice === 'tablet' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`mx-auto transition-all duration-300 ${
            previewDevice === 'desktop' ? 'max-w-4xl' : previewDevice === 'tablet' ? 'max-w-xl' : 'max-w-sm'
          }`}>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-purple-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-purple-600">Client Preview Mode</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700">Live Engine</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What type of website do you need?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeForm.categories?.slice(0, 6).map((c) => (
                  <div key={String(c.id)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">
                    {String(c.name)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION EDIT / CREATE MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {questionEditing ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="e.g. What are your primary specialties or signature items?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Input Box Label (Client Form)</label>
                  <input
                    type="text"
                    value={qLabel}
                    onChange={(e) => setQLabel(e.target.value)}
                    placeholder="e.g. Signature Specialties / Menu Items"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Default Selected Value / Option</label>
                  <input
                    type="text"
                    value={qDefaultValue}
                    onChange={(e) => setQDefaultValue(e.target.value)}
                    placeholder="e.g. Biryani, North Indian (or default radio/select)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-purple-700 dark:text-purple-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Helper Text / Sub-description</label>
                <input
                  type="text"
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  placeholder="e.g. We will highlight these signature items in your digital menu & hero banner."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Step Assignment</label>
                  <select
                    value={qStepId}
                    onChange={(e) => setQStepId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    {activeForm.steps?.map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>{String(s.title)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category Binding</label>
                  <select
                    value={qCategoryId}
                    onChange={(e) => setQCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="all">All Categories (Global)</option>
                    {activeForm.categories?.map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Field Input Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="text">Single-line Text</option>
                    <option value="textarea">Multi-line Textarea</option>
                    <option value="select">Dropdown Select</option>
                    <option value="multiselect">Multi-Select Checkboxes</option>
                    <option value="radio">Radio Options</option>
                    <option value="phone">Phone / WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="toggle">Toggle Yes/No</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    value={qPlaceholder}
                    onChange={(e) => setQPlaceholder(e.target.value)}
                    placeholder="e.g. North Indian, Biryani"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Display Sequence (Order)</label>
                  <input
                    type="number"
                    value={qOrder}
                    onChange={(e) => setQOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {['select', 'multiselect', 'radio', 'checkbox', 'multi_select'].includes(qType) && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Options (Comma Separated)</label>
                  <input
                    type="text"
                    value={qOptions}
                    onChange={(e) => setQOptions(e.target.value)}
                    placeholder="Option 1, Option 2, Option 3, Option 4"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="qReqCheck"
                    checked={qRequired}
                    onChange={(e) => setQRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="qReqCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Mandatory Field (Required to proceed)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="qEnabledCheck"
                    checked={qEnabled}
                    onChange={(e) => setQEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="qEnabledCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Active / Enabled (Visible to Clients)
                  </label>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Website Category</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Dance Academy"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Badge</label>
                <input
                  type="text"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  placeholder="e.g. High Demand"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Description of deliverables..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Modal */}
      {stepModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Onboarding Step</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Step Title *</label>
                <input
                  type="text"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  placeholder="e.g. 13 Social & Marketing Setup"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Step Subtitle</label>
                <input
                  type="text"
                  value={stepSubtitle}
                  onChange={(e) => setStepSubtitle(e.target.value)}
                  placeholder="e.g. Social ads, Meta pixel & marketing"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStepModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStep}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
              >
                Add Step
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminFormBuilder() {
  return (
    <FormBuilderErrorBoundary>
      <AdminFormBuilderContent />
    </FormBuilderErrorBoundary>
  );
}
