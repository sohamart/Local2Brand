import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckCircle, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Projects = () => {
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
        console.error('Error fetching user projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      Planning: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      Design: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      Development: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      Testing: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      Review: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      Completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      Launched: 'bg-emerald-500/20 border-emerald-500/35 text-emerald-300',
    };
    return (
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${styles[status] || 'bg-slate-500/10 text-slate-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Your Website Projects</h1>
          <p className="text-xs text-slate-500">View current progress metrics and development stages.</p>
        </div>
        <Link
          to="/start-project"
          className="liquid-btn px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <PlusCircle size={14} />
          New Website Request
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-dashed border-slate-350 dark:border-white/5 rounded-[28px] space-y-4 glass-panel">
          <p className="text-slate-600 dark:text-slate-400 text-xs">No active projects logged yet.</p>
          <Link
            to="/start-project"
            className="liquid-btn px-5 py-2.5 text-xs inline-flex items-center gap-2"
          >
            Submit your first project request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] p-6 space-y-6 flex flex-col justify-between glass-panel"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{project.name}</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-500 mt-0.5">{project.category} Template Setup</p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400">Launch Timeline</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-650 dark:text-slate-400">
                  <Clock size={13} className="text-slate-500" />
                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/dashboard/projects/${project._id}`}
                  className="text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-750 dark:hover:text-yellow-350 font-bold flex items-center gap-1"
                >
                  View Details & Stages
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
