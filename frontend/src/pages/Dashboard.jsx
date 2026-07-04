import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { skillApi, activityApi, matchApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [mine, setMine] = useState({ offered: [], wanted: [] });
  const [activity, setActivity] = useState([]);
  const [matches, setMatches] = useState([]);
  const [searching, setSearching] = useState(false);

  const load = () => {
    skillApi.mine().then((res) => {console.log("Mine Api: "+res.data);setMine(res.data);});
    activityApi.recent().then((res) => setActivity(res.data));
    matchApi.myMatches().then((res) => setMatches(res.data));
  };

  useEffect(()=>{load();}, []);

  const runMatchSearch = async () => {
    setSearching(true);
    try {
      await matchApi.search();
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const chartData = [
    { name: 'Skills Offered', count: mine.offered.length },
    { name: 'Skills Wanted', count: mine.wanted.length },
    { name: 'Matches', count: matches.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.fullName}</h1>
          <p className="text-slate-500 mt-1">Here's your skill exchange activity.</p>
        </div>
        <button
          onClick={runMatchSearch} disabled={searching}
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {searching ? 'Searching...' : '🔍 Find New Matches'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-brand-600">{mine.offered.length}</p>
          <p className="text-slate-500 text-sm mt-1">Skills Offered</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-brand-600">{mine.wanted.length}</p>
          <p className="text-slate-500 text-sm mt-1">Skills Wanted</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-brand-600">{matches.length}</p>
          <p className="text-slate-500 text-sm mt-1">Total Matches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-slate-400 text-sm">No activity yet.</p>
          ) : (
            <ul className="space-y-3 max-h-56 overflow-y-auto">
              {activity.map((a) => (
                <li key={a.id} className="text-sm flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-700">{a.action.replace(/_/g, ' ')}</span>
                  <span className="text-slate-400 text-xs">{a.executionTimeMs}ms</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
