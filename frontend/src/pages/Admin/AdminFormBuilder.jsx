import React, { useState, useEffect, Component } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Eye,
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
  Filter,
  RotateCcw,
  CheckSquare,
  Square,
  ListPlus,
  ArrowRight
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

  // Filters
  const [questionStepFilter, setQuestionStepFilter] = useState('all');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState('all');

  // Question Modal State
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
  const [qOptionsList, setQOptionsList] = useState([]); // Array of { id, label, value, isDefault }
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
      toast.error('Failed to load form schema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

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

  const handleResetToStandard = async () => {
    if (!window.confirm('Are you sure you want to reset all 12 steps and questions to the standard official template? Any custom modifications will be re-aligned with the default 12-step catalog.')) {
      return;
    }

    setSaving(true);
    try {
      const res = await api.post(`/forms/admin/${activeForm?._id || 'default'}/reset`);
      if (res.success && res.form) {
        setActiveForm(res.form);
        toast.success('All 12 steps and questions restored to standard schema! 🔄');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reset schema');
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
    setQStepId(questionStepFilter !== 'all' ? questionStepFilter : 'step_client');
    setQCategoryId(questionCategoryFilter !== 'all' ? questionCategoryFilter : 'all');
    setQType('text');
    setQPlaceholder('');
    setQDescription('');
    setQOptionsList([
      { id: 'opt_1', label: '', value: '', isDefault: false }
    ]);
    setQRequired(false);
    setQEnabled(true);
    setQOrder((activeForm?.questions?.length || 0) + 1);
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setQuestionEditing(q);
    setQTitle(typeof q.title === 'string' ? q.title : '');
    setQLabel(typeof q.label === 'string' ? q.label : (typeof q.inputLabel === 'string' ? q.inputLabel : ''));
    
    const defVal = typeof q.defaultValue === 'string' ? q.defaultValue : (typeof q.defaultSelected === 'string' ? q.defaultSelected : '');
    setQDefaultValue(defVal);
    
    setQStepId(typeof q.stepId === 'string' ? q.stepId : 'step_client');
    setQCategoryId(typeof q.categoryId === 'string' ? q.categoryId : 'all');
    setQType(typeof q.type === 'string' ? q.type : 'text');
    setQPlaceholder(typeof q.placeholder === 'string' ? q.placeholder : '');
    setQDescription(typeof q.description === 'string' ? q.description : (typeof q.helperText === 'string' ? q.helperText : ''));

    // Parse options list
    let opts = [];
    if (Array.isArray(q.options) && q.options.length > 0) {
      opts = q.options.map((opt, idx) => {
        const val = typeof opt === 'object' ? (opt.value || opt.label || '') : String(opt);
        const lbl = typeof opt === 'object' ? (opt.label || opt.value || '') : String(opt);
        const isDef = defVal ? defVal.includes(val) || defVal.includes(lbl) : false;
        return {
          id: opt.id || `opt_${idx + 1}`,
          label: lbl,
          value: val,
          isDefault: isDef
        };
      });
    } else {
      opts = [
        { id: 'opt_1', label: '', value: '', isDefault: false }
      ];
    }
    setQOptionsList(opts);

    setQRequired(Boolean(q.required));
    setQEnabled(q.enabled !== false);
    setQOrder(Number(q.order || 1));
    setQuestionModalOpen(true);
  };

  const handleAddOptionRow = () => {
    setQOptionsList((prev) => [
      ...prev,
      { id: `opt_${Date.now()}`, label: '', value: '', isDefault: false }
    ]);
  };

  const handleRemoveOptionRow = (idx) => {
    setQOptionsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx, field, val) => {
    setQOptionsList((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      if (field === 'label' && !copy[idx].value) {
        copy[idx].value = val;
      }
      return copy;
    });
  };

  const handleToggleOptionDefault = (idx) => {
    setQOptionsList((prev) => {
      const isSingleChoice = ['radio', 'select'].includes(qType);
      const copy = prev.map((opt, i) => {
        if (i === idx) {
          const nextState = !opt.isDefault;
          return { ...opt, isDefault: nextState };
        }
        return isSingleChoice ? { ...opt, isDefault: false } : opt;
      });

      // Update qDefaultValue string
      const defaultVals = copy.filter((o) => o.isDefault).map((o) => o.value || o.label).filter(Boolean);
      setQDefaultValue(defaultVals.join(', '));
      return copy;
    });
  };

  const handleSaveQuestion = () => {
    if (!qTitle.trim()) {
      toast.error('Please provide question title');
      return;
    }

    const hasOptions = ['select', 'multi_select', 'multiselect', 'radio', 'checkbox'].includes(qType);
    const validOptions = hasOptions
      ? qOptionsList
          .filter((o) => o.label?.trim() || o.value?.trim())
          .map((o, idx) => ({
            id: o.id || `opt_${idx + 1}`,
            label: o.label.trim() || o.value.trim(),
            value: o.value.trim() || o.label.trim(),
            order: idx + 1
          }))
      : [];

    // Calculate default value from checked options or text input
    let computedDefault = qDefaultValue.trim();
    if (hasOptions && validOptions.length > 0) {
      const selectedOpts = qOptionsList.filter((o) => o.isDefault && (o.value || o.label));
      if (selectedOpts.length > 0) {
        computedDefault = selectedOpts.map((o) => o.value || o.label).join(', ');
      }
    }

    const newQuestion = {
      id: questionEditing ? String(questionEditing.id) : `q_${Date.now()}`,
      title: String(qTitle),
      label: String(qLabel || qTitle),
      inputLabel: String(qLabel || qTitle),
      defaultValue: computedDefault,
      defaultSelected: computedDefault,
      stepId: String(qStepId),
      categoryId: String(qCategoryId),
      type: String(qType),
      placeholder: String(qPlaceholder || ''),
      description: String(qDescription || ''),
      helperText: String(qDescription || ''),
      options: validOptions,
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
    toast.success(`Question "${qTitle}" updated in draft!`);
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
    toast.success(`Category "${catName}" saved!`);
  };

  const handleDeleteCategory = (catId) => {
    if (window.confirm('Delete this category?')) {
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
    toast.success(`Step "${stepTitle}" saved!`);
  };

  const handleDeleteStep = (stepId) => {
    if (window.confirm('Delete this step?')) {
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

  // Filter questions by both Step and Category
  const filteredQuestions = (activeForm.questions || []).filter((q) => {
    const matchStep = questionStepFilter === 'all' || String(q.stepId) === String(questionStepFilter);
    const matchCat = questionCategoryFilter === 'all' || String(q.categoryId) === String(questionCategoryFilter) || String(q.categoryId) === 'all';
    return matchStep && matchCat;
  });

  const getStepTitleById = (stepId) => {
    const s = (activeForm.steps || []).find((st) => st.id === stepId);
    return s ? `${s.stepNumber}. ${s.title}` : stepId;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <AshokaChakra size={11} />
            <span>Dynamic 12-Step Form Engine • v{String(activeForm.version || '2.0')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Form Questions & Step-wise Builder
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Step-by-step manager for every question, input label, placeholder, helper text, and default selected options across all 12 onboarding steps.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToStandard}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            title="Restore all 12 steps and complete questions from official catalog"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset to Standard 12 Steps</span>
          </button>

          <button
            onClick={handleSaveForm}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-purple-600" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublishLive}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'questions', label: `12-Step Questions (${activeForm.questions?.length || 0})` },
          { id: 'steps', label: `Onboarding Steps (${activeForm.steps?.length || 0})` },
          { id: 'categories', label: `Website Categories (${activeForm.categories?.length || 0})` },
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

      {/* TAB 1: 12-STEP DYNAMIC QUESTIONS BUILDER */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          
          {/* Step Filter Ribbon (Step 1 to Step 12) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Filter by Onboarding Step:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Showing {filteredQuestions.length} of {activeForm.questions?.length || 0} questions
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
              <button
                onClick={() => setQuestionStepFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  questionStepFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600'
                }`}
              >
                All 12 Steps ({activeForm.questions?.length || 0})
              </button>
              {activeForm.steps?.map((st) => {
                const count = (activeForm.questions || []).filter((q) => q.stepId === st.id).length;
                return (
                  <button
                    key={st.id}
                    onClick={() => setQuestionStepFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      questionStepFilter === st.id
                        ? 'l2b-gradient-bg text-white shadow-xs font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-70">#{st.stepNumber}</span>
                    <span>{st.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter & Add Question Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Business Category:</span>
              <select
                value={questionCategoryFilter}
                onChange={(e) => setQuestionCategoryFilter(e.target.value)}
                className="p-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="all">All Categories (Global & All Specifics)</option>
                {activeForm.categories?.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Question</span>
            </button>
          </div>

          {/* Questions Grid / List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <FileQuestion className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p>No questions found for this step and category filter.</p>
                <button
                  onClick={handleOpenAddQuestion}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Question to this Step</span>
                </button>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const stepName = getStepTitleById(q.stepId);
                const isOptionBased = ['select', 'multi_select', 'multiselect', 'radio', 'checkbox'].includes(q.type);

                return (
                  <div
                    key={String(q.id || idx)}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs hover:border-purple-400/60 transition-all"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-purple-200/80 dark:border-purple-800">
                        {idx + 1}
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        {/* Tags Row */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {stepName}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            Type: {typeof q.type === 'string' ? q.type : 'text'}
                          </span>
                          {q.required ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                              Required *
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                              Optional
                            </span>
                          )}
                          {q.enabled === false ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                              Disabled
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Active
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Category: {q.categoryId === 'all' ? 'All (Global)' : String(q.categoryId || 'Custom')}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                          {typeof q.title === 'string' ? q.title : String(q.title || '')}
                        </h4>

                        {/* Input Label */}
                        {(q.label || q.inputLabel) && (
                          <div className="text-xs text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>Input Box Label: <strong>"{q.label || q.inputLabel}"</strong></span>
                          </div>
                        )}

                        {/* Default Selected Option Display */}
                        {(q.defaultValue || q.defaultSelected) && (
                          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 inline-flex flex-wrap">
                            <CheckSquare className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <span>Default Selected: <strong>"{q.defaultValue || q.defaultSelected}"</strong></span>
                          </div>
                        )}

                        {/* Description / Subtitle */}
                        {(q.description || q.helperText) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {q.description || q.helperText}
                          </p>
                        )}

                        {/* Placeholder */}
                        {q.placeholder && (
                          <p className="text-[11px] text-slate-400 font-mono">
                            Placeholder: "{typeof q.placeholder === 'string' ? q.placeholder : ''}"
                          </p>
                        )}

                        {/* Options chips */}
                        {isOptionBased && Array.isArray(q.options) && q.options.length > 0 && (
                          <div className="pt-1.5 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                              Available Options ({q.options.length}):
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {q.options.map((opt, optIdx) => {
                                const val = typeof opt === 'object' ? (opt.value || opt.label) : String(opt);
                                const lbl = typeof opt === 'object' ? (opt.label || opt.value) : String(opt);
                                const isDef = (q.defaultValue || q.defaultSelected || '').includes(val) || (q.defaultValue || q.defaultSelected || '').includes(lbl);

                                return (
                                  <span
                                    key={optIdx}
                                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                                      isDef
                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {isDef && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                                    <span>{lbl}</span>
                                    {isDef && <span className="text-[9px] font-mono font-bold text-emerald-600">(Default)</span>}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                        title="Edit Question & Labels"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-800 cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ONBOARDING STEPS */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              12 Onboarding Wizard Steps
            </span>
            <button
              onClick={handleOpenAddStep}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-purple-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Step</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {activeForm.steps?.map((st, idx) => {
              const qCount = (activeForm.questions || []).filter((q) => q.stepId === st.id).length;
              return (
                <div
                  key={String(st.id || idx)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-black text-xs shrink-0 border border-purple-200 dark:border-purple-800">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{typeof st.title === 'string' ? st.title : String(st.title || '')}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                          {qCount} question(s)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {typeof st.subtitle === 'string' ? st.subtitle : 'Step section'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{String(st.id)}</span>
                    <button
                      onClick={() => {
                        setStepEditing(st);
                        setStepTitle(st.title);
                        setStepSubtitle(st.subtitle || '');
                        setStepModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-purple-600 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 cursor-pointer"
                      title="Edit step"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStep(st.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1.5"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              13 Business Categories & Templates
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
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
                className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${previewDevice === 'tablet' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 shadow-xs' : 'text-slate-500'}`}
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700">12 Steps Active</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 1: Category & Vision
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

      {/* ========================================================================= */}
      {/* RICH QUESTION EDIT / ADD MODAL WITH DEFAULT SELECTED PICKER */}
      {/* ========================================================================= */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>{questionEditing ? 'Edit Question & Options' : 'Add New Question to Step'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Question Title */}
              <div>
                <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                  Question Title / Heading *
                </label>
                <input
                  type="text"
                  required
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="e.g. What Type of Website or Business are We Building?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Input Label & Step Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    🏷️ Input Box Label (Displayed on Form)
                  </label>
                  <input
                    type="text"
                    value={qLabel}
                    onChange={(e) => setQLabel(e.target.value)}
                    placeholder="e.g. Business / Brand Name *"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    📂 Step Assignment (1 of 12)
                  </label>
                  <select
                    value={qStepId}
                    onChange={(e) => setQStepId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    {activeForm.steps?.map((s) => (
                      <option key={String(s.id)} value={String(s.id)}>
                        Step {s.stepNumber}: {String(s.title)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Binding & Input Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    🏢 Category Binding
                  </label>
                  <select
                    value={qCategoryId}
                    onChange={(e) => setQCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="all">All Categories (Global to all businesses)</option>
                    {activeForm.categories?.map((c) => (
                      <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                    🎛️ Field Input Type
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="text">Single-line Text</option>
                    <option value="textarea">Multi-line Textarea</option>
                    <option value="radio">Radio Single-Select Options</option>
                    <option value="select">Dropdown Select (Single)</option>
                    <option value="multi_select">Multi-Select Checkboxes</option>
                    <option value="phone">Phone / WhatsApp Number</option>
                    <option value="email">Email Address</option>
                    <option value="url">Website URL</option>
                    <option value="file">Photo / Asset File Upload</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>

              {/* Helper Description */}
              <div>
                <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                  Helper Text / Sub-description
                </label>
                <input
                  type="text"
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  placeholder="e.g. Highlight your signature items to be featured prominently on your digital menu."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                  Placeholder Text (Inside Input Box)
                </label>
                <input
                  type="text"
                  value={qPlaceholder}
                  onChange={(e) => setQPlaceholder(e.target.value)}
                  placeholder="e.g. e.g. Awadhi Dum Biryani, Mutton Kosha..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* ========================================================================= */}
              {/* DYNAMIC OPTIONS LIST BUILDER WITH DEFAULT SELECT TOGGLES */}
              {/* ========================================================================= */}
              {['select', 'multi_select', 'multiselect', 'radio', 'checkbox'].includes(qType) && (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-purple-900 dark:text-purple-200 text-xs block">
                        Choice Options & Default Selected Picker
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Check the radio/box next to an option to mark it as <strong>Selected by Default</strong> on page load.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddOptionRow}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {qOptionsList.map((opt, oIdx) => (
                      <div key={opt.id || oIdx} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        
                        {/* Default Select Button / Indicator */}
                        <button
                          type="button"
                          onClick={() => handleToggleOptionDefault(oIdx)}
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            opt.isDefault
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                          }`}
                          title={opt.isDefault ? 'Default Selected Option (Click to toggle)' : 'Set as Default Selected'}
                        >
                          {opt.isDefault ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          <span className="text-[10px] hidden sm:inline">{opt.isDefault ? 'Default' : 'Set Default'}</span>
                        </button>

                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleOptionChange(oIdx, 'label', e.target.value)}
                          placeholder={`Option ${oIdx + 1} Label`}
                          className="flex-1 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-xs"
                        />

                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => handleOptionChange(oIdx, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-24 sm:w-32 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300 text-[11px]"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveOptionRow(oIdx)}
                          disabled={qOptionsList.length <= 1}
                          className="p-1.5 text-red-500 hover:text-red-700 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Selected Value (Manual text box fallback) */}
              <div>
                <label className="font-black text-slate-800 dark:text-slate-200 block mb-1">
                  ⚡ Default Selected Value (Pre-filled value on form load)
                </label>
                <input
                  type="text"
                  value={qDefaultValue}
                  onChange={(e) => setQDefaultValue(e.target.value)}
                  placeholder="e.g. Dum Biryani, Mughlai Gravies (or default option value)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-emerald-700 dark:text-emerald-300"
                />
              </div>

              {/* Checkboxes: Required, Enabled, Order */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={qRequired}
                    onChange={(e) => setQRequired(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Required Field (*)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={qEnabled}
                    onChange={(e) => setQEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Active & Enabled</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Order:</span>
                  <input
                    type="number"
                    value={qOrder}
                    onChange={(e) => setQOrder(Number(e.target.value))}
                    className="w-16 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-center text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 cursor-pointer"
              >
                {questionEditing ? 'Save Changes' : 'Add Question'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {catEditing ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Travel / Tourism Agency"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Badge Text (Optional)</label>
                <input
                  type="text"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  placeholder="e.g. Trending / New"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Short description of this industry build..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP MODAL */}
      {stepModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {stepEditing ? 'Edit Step' : 'Add Custom Step'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Step Title *</label>
                <input
                  type="text"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  placeholder="e.g. SEO & Analytics Integration"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Step Subtitle</label>
                <input
                  type="text"
                  value={stepSubtitle}
                  onChange={(e) => setStepSubtitle(e.target.value)}
                  placeholder="e.g. Google Analytics, Pixel and Schema setup"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setStepModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStep}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white l2b-gradient-bg"
              >
                Save Step
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
