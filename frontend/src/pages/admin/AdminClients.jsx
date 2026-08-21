import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('/admin/clients');
        if (res.data?.clients) {
          setClients(res.data.clients);
        }
      } catch (err) {
        console.error('Error fetching clients list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Client Management</h1>
        <p className="text-xs text-slate-500 font-mono">View all client accounts registered on the Local2Brand platform.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : clients.length === 0 ? (
        <div className="text-center py-20 bg-[#090d1a]/50 border border-white/5 rounded-2xl">
          <p className="text-slate-400 text-xs">No clients registered yet.</p>
        </div>
      ) : (
        <div className="bg-[#090d1a] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">Client name</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Email Address</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Phone number</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-200">{client.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Mail size={12} className="text-slate-500" />
                        {client.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Phone size={12} className="text-slate-500" />
                        {client.phone}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(client.createdAt).toLocaleDateString()}
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

export default AdminClients;
