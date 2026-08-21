import React, { useState, useEffect } from 'react';
import { Briefcase, Check, PlusCircle } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get('/portfolio');
        if (res.data?.portfolio) {
          setPortfolio(res.data.portfolio);
        }
      } catch (err) {
        console.error('Error fetching portfolio case studies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Case Studies</h1>
        <p className="text-xs text-slate-500 font-mono">Manage case studies published on the public portfolio gallery.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : portfolio.length === 0 ? (
        <div className="text-center py-20 bg-[#090d1a]/50 border border-white/5 rounded-2xl">
          <p className="text-slate-400 text-xs">No case studies logged yet.</p>
        </div>
      ) : (
        <div className="bg-[#090d1a] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">Project Title</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Client</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {portfolio.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-200">{item.title}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-400">{item.client}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">
                        {item.industry}
                      </span>
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

export default AdminPortfolio;
