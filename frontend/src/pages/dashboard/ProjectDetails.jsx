import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileCode, Landmark, MessageSquare, AlertCircle, ArrowLeft, Download, Paperclip } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        if (res.data?.project) {
          setProject(res.data.project);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return;

    try {
      const res = await API.post(`/projects/${id}/files`, { name: fileName, url: fileUrl });
      if (res.data?.success) {
        setProject(res.data.project);
        setFileName('');
        setFileUrl('');
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('File upload error', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="text-center py-10 space-y-4">
      <AlertCircle className="text-red-500 mx-auto" size={32} />
      <p className="text-red-400 font-semibold">{error}</p>
      <Link to="/dashboard/projects" className="text-xs text-indigo-400 hover:underline">Back to projects</Link>
    </div>
  );

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Back button */}
      <Link to="/dashboard/projects" className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold">
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      {/* Project Overview Card */}
      <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center glass-panel">
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h2>
          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">{project.description}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Launch progress</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-yellow-600 dark:text-yellow-450">{project.progress}%</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-650 dark:text-yellow-400 uppercase font-mono font-bold">
              {project.status}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${project.progress}%` }}></div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Assigned Team</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
              A
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Local2Brand Admin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Detailed Timeline Stages */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-6 glass-panel">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/5 pb-3">Development Stages Timeline</h3>
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
            {project.stages.map((stage) => {
              const isCompleted = stage.status === 'Completed';
              const isInProgress = stage.status === 'In Progress';
              return (
                <div key={stage.stageName} className="flex items-start gap-5 relative pl-8">
                  {/* Status Indicator bubble */}
                  <div className="absolute left-0 top-0.5 shrink-0 z-10">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 border border-emerald-500/35 text-white flex items-center justify-center shadow shadow-emerald-500/20">
                        <CheckCircle size={14} />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-7 h-7 rounded-full bg-yellow-500/15 border border-yellow-500 text-yellow-600 dark:text-yellow-450 flex items-center justify-center animate-pulse">
                        <Clock size={14} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-white/5 text-slate-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-700"></div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-700 dark:text-slate-300' : isInProgress ? 'text-yellow-600 dark:text-yellow-450' : 'text-slate-400'}`}>
                        {stage.stageName}
                      </h4>
                      <span className="text-[9px] text-slate-500">{new Date(stage.date).toLocaleDateString()}</span>
                    </div>

                    {stage.adminNote && (
                      <p className="text-[11px] text-slate-650 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 leading-relaxed">
                        {stage.adminNote}
                      </p>
                    )}

                    {stage.attachments && stage.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {stage.attachments.map((file, fidx) => (
                          <a
                            key={fidx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-white/10 text-[9px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-955 dark:hover:text-white"
                          >
                            <Download size={10} />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Files & Upload Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-4 glass-panel">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Submit Project Attachments</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              {uploadSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-semibold">
                  File attachment saved successfully!
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Attachment Label</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-350 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. Logo Vector Asset"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-505 uppercase tracking-wider">File/Drive URL</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-355 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. https://drive.google.com/..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold liquid-btn flex items-center justify-center gap-1.5"
              >
                <Paperclip size={13} />
                Attach File Reference
              </button>
            </form>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-4 glass-panel">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Project Support</h3>
            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">
              If you have any feedback or want layout changes, use our instant messenger.
            </p>
            <Link
              to={`/dashboard/messages`}
              className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={13} />
              Open Chat Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
