import React, { useState, useEffect } from 'react';
import { FolderKanban, Check, ArrowRight, Edit3, Settings, AlertCircle, FileText, Calendar, PlusCircle, Paperclip } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  // Stage update states
  const [stageName, setStageName] = useState('');
  const [stageStatus, setStageStatus] = useState('Pending');
  const [adminNote, setAdminNote] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await API.get('/admin/projects');
      if (res.data?.projects) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Error fetching admin projects list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenUpdate = (proj) => {
    setSelectedProject(proj);
    setStageName(proj.stages[0]?.stageName || '');
    setStageStatus(proj.stages[0]?.status || 'Pending');
    setAdminNote(proj.stages[0]?.adminNote || '');
    setAttachmentName('');
    setAttachmentUrl('');
    setSuccessMsg('');
  };

  // Pre-load note and status when shifting target stage
  const handleStageSelect = (name) => {
    setStageName(name);
    const targetStage = selectedProject.stages.find(s => s.stageName === name);
    if (targetStage) {
      setStageStatus(targetStage.status);
      setAdminNote(targetStage.adminNote || '');
    }
  };

  const handleUpdateStageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !stageName) return;

    const payload = {
      stageName,
      status: stageStatus,
      adminNote,
    };

    // Attach mock files if entered
    if (attachmentName && attachmentUrl) {
      payload.attachments = [{ name: attachmentName, url: attachmentUrl }];
    }

    try {
      const res = await API.put(`/admin/projects/${selectedProject._id}/stages`, payload);
      if (res.data?.success) {
        setSuccessMsg(`Stage "${stageName}" updated successfully!`);
        // Refresh project list and selected project
        fetchProjects();
        setSelectedProject(res.data.project);
        setAttachmentName('');
        setAttachmentUrl('');
      }
    } catch (err) {
      console.error('Error updating project stage timeline', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Project Controls</h1>
        <p className="text-xs text-slate-500">Update development stages, logs, budgets, and files.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-[#090d1a]/50 border border-white/5 rounded-2xl">
          <p className="text-slate-400 text-xs">No project instances created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Log List */}
          <div className="lg:col-span-2 bg-[#090d1a] border border-white/5 rounded-2xl p-5 overflow-hidden shadow-lg h-fit">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-3">All Active Projects</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                    <th className="p-4 font-bold uppercase tracking-wider">Project Name</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Client</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Progress</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-200">{proj.name}</p>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase mt-1 inline-block">
                          {proj.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-400">{proj.client?.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">{proj.progress}%</span>
                          <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenUpdate(proj)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-750 text-[10px] font-bold text-slate-200 cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Edit3 size={11} />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Update Progress Form Panel */}
          {selectedProject && (
            <div className="lg:col-span-1 bg-[#090d1a] border border-white/5 rounded-2xl p-5 space-y-6 shadow-xl h-fit">
              <div>
                <h3 className="font-bold text-sm text-white">Update Timeline Stages</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Project: {selectedProject.name}</p>
              </div>

              <form onSubmit={handleUpdateStageSubmit} className="space-y-4">
                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-semibold flex items-center gap-2">
                    <Check size={12} />
                    {successMsg}
                  </div>
                )}

                {/* Select Stage Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Select Timeline Stage</label>
                  <select
                    value={stageName}
                    onChange={(e) => handleStageSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {selectedProject.stages.map((stage) => (
                      <option key={stage.stageName} value={stage.stageName}>
                        {stage.stageName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Status */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Stage Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Pending', 'In Progress', 'Completed'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStageStatus(status)}
                        className={`py-1.5 rounded-lg border text-center text-[10px] font-bold transition-all cursor-pointer ${
                          stageStatus === status
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                            : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin notes */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Admin Checklist Notes</label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Provide stage description details..."
                  />
                </div>

                {/* Add files mock fields */}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Add Checkpoint Attachment</span>
                  <div className="space-y-1.5 text-left">
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Figma Design Link"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. https://figma.com/..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Settings size={13} />
                  Commit Changes
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
