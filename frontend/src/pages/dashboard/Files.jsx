import React, { useState, useEffect } from 'react';
import { FileCode, Download, FolderPlus, HelpCircle } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Files = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        if (res.data?.projects) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        console.error('Error fetching files', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Collect all files from project stages
  const projectFiles = projects.flatMap(p =>
    p.stages.flatMap(s =>
      s.attachments.map(a => ({
        ...a,
        projectName: p.name,
        stageName: s.stageName,
        date: s.date
      }))
    )
  );

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Project Files</h1>
        <p className="text-xs text-slate-500">Download guidelines, brand design blueprints, and final packages.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projectFiles.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] space-y-2 glass-panel">
          <p className="text-slate-650 dark:text-slate-400 text-xs">No project files posted yet.</p>
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
            Once development starts, guidelines and figma file URLs will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] overflow-hidden shadow-lg glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">File Details</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Project Link</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Stage</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {projectFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-450 flex items-center justify-center shrink-0 font-bold">
                        <FileCode size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{file.name}</p>
                        <span className="text-[9px] text-slate-550">{new Date(file.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{file.projectName}</td>
                    <td className="p-4">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-white/10 text-slate-650 dark:text-slate-400">
                        {file.stageName}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold liquid-btn"
                      >
                        <Download size={11} />
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
