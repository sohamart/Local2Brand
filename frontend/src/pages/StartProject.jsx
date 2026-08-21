import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, Laptop, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../services/api';

const StartProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [websiteType, setWebsiteType] = useState('');
  const [startMethod, setStartMethod] = useState('');
  const [features, setFeatures] = useState([]);
  const [budget, setBudget] = useState('');
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    description: '',
  });

  // Pre-select demo template if passed in URL
  const selectedDemoId = searchParams.get('demo');

  useEffect(() => {
    if (selectedDemoId) {
      setStartMethod('Choose Local2Brand Design');
      setStep(2); // Jump to step 2 directly to proceed
    }
  }, [selectedDemoId]);

  const handleFeatureToggle = (feature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !websiteType) return;
    if (step === 2 && !startMethod) return;
    if (step === 4 && !budget) return;
    if (step === 5 && (!businessInfo.businessName || !businessInfo.description)) return;

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate(`/login?redirect=/start-project`);
      return;
    }

    setLoading(true);
    setError('');

    const formattedBudget = parseInt(budget.replace(/[^0-9]/g, '')) || 10000;

    const requestPayload = {
      name: `${businessInfo.businessName} Website`,
      category: websiteType,
      budget: formattedBudget,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days deadline
      description: `Start Method: ${startMethod}. Description: ${businessInfo.description}. Required Features: ${features.join(', ')}`,
      demoSelected: selectedDemoId || null,
    };

    try {
      const res = await API.post('/projects', requestPayload);
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const websiteTypes = ['Business', 'Restaurant', 'Portfolio', 'E-commerce', 'Education', 'Healthcare', 'Other'];
  const startMethods = ['Choose Local2Brand Design', 'I Have My Own Design', 'I Need A Custom Design'];
  const availableFeatures = ['Contact Form', 'WhatsApp', 'Authentication', 'Payment', 'Admin Panel', 'Blog', 'Booking', 'E-commerce', 'Custom Feature'];
  const budgets = ['Under ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000+', 'Let\'s Discuss'];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-left">
      {/* Step Indicators */}
      {!success && (
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-white/5 pb-4 select-none">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Step {step} of 6</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-colors ${
                  step >= s ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {success ? (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center space-y-6 glass-panel">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Project Request Received</h2>
            <p className="text-xs text-slate-650 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your request has been sent to the Local2Brand team. We have generated an active tracker in your client dashboard.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-xs font-bold text-black shadow-md shadow-yellow-500/10"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-8 min-h-[380px] flex flex-col justify-between glass-panel">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">What type of website do you need?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {websiteTypes.map((type) => (
                    <button
                       key={type}
                       onClick={() => setWebsiteType(type)}
                       className={`px-4 py-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                         websiteType === type
                           ? 'bg-yellow-500/10 border-yellow-500 text-yellow-650 dark:text-yellow-450'
                           : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                       }`}
                    >
                      {type}
                      {websiteType === type && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">How would you like to start?</h3>
                <div className="flex flex-col gap-3">
                  {startMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => setStartMethod(method)}
                      className={`px-4 py-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        startMethod === method
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-650 dark:text-yellow-455'
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {method}
                      {startMethod === method && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">What features do you need?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableFeatures.map((feature) => {
                    const isSelected = features.includes(feature);
                    return (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`px-3 py-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-650 dark:text-yellow-455'
                            : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {feature}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select your budget range</h3>
                <div className="flex flex-col gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`px-4 py-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        budget === b
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-650 dark:text-yellow-455'
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-white/10 text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {b}
                      {budget === b && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Information</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-350 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                      placeholder="e.g. Luigi Italian Bistro"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Type (Optional)</label>
                    <input
                      type="text"
                      value={businessInfo.businessType}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-350 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                      placeholder="e.g. Restaurant"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-350 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 resize-none"
                      placeholder="e.g. Create a menu visualization and reservations booking form..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Project Specifications</h3>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    {error}
                  </div>
                )}
                <div className="p-5 bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-white/5 rounded-2xl space-y-3.5 text-xs text-slate-700 dark:text-slate-350">
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-medium">Website Sector:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{websiteType}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-medium">Start Approach:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{startMethod}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-medium">Target Budget:</span>
                    <span className="font-extrabold text-yellow-600 dark:text-yellow-450">{budget}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                    <span className="text-slate-500 font-medium">Business Name:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{businessInfo.businessName}</span>
                  </div>
                  <div className="border-b border-slate-200 dark:border-white/5 pb-2 text-left">
                    <p className="text-slate-500 font-medium">Requested Features:</p>
                    <p className="font-semibold text-slate-600 dark:text-slate-250 mt-1">{features.length > 0 ? features.join(', ') : 'None requested'}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-slate-500 font-medium">Project Overview:</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{businessInfo.description}</p>
                  </div>
                </div>

                {!user && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 flex items-start gap-3">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold">Authentication Required</h4>
                      <p className="text-[10px] text-amber-400/80 mt-0.5 leading-relaxed">
                        Please <Link to="/login?redirect=/start-project" className="underline font-bold text-amber-300">Login</Link> or{' '}
                        <Link to="/register" className="underline font-bold text-amber-300">Register</Link> to submit your request and view details on the active stages tracker.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-white/5 pt-5 mt-auto">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 6 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 text-xs font-bold liquid-btn"
              >
                Continue
                <ArrowRight size={13} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !user}
                className="px-6 py-3 disabled:bg-slate-300 disabled:text-slate-500 text-xs font-bold liquid-btn"
              >
                {loading ? 'Submitting request...' : 'Submit Project Request'}
                <Check size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartProject;
