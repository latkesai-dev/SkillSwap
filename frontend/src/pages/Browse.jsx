import { useEffect, useState } from 'react';
import { skillApi } from '../api/client';

export default function Browse() {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillApi.browse()
      .then((res) => setSkills(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = skills.filter((s) =>
    s.skillName.toLowerCase().includes(query.toLowerCase())
  );

  const levelColor = {
    BEGINNER: 'bg-amber-100 text-amber-700',
    INTERMEDIATE: 'bg-blue-100 text-blue-700',
    EXPERT: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Skills</h1>
        <p className="text-slate-500 mt-1">Find people teaching what you want to learn — pay with a skill of your own.</p>
      </div>
      <input
        type="text" placeholder="Search skills (e.g. Guitar, Excel, Photography)..."
        value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md border border-slate-300 rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {loading ? (
        <p className="text-slate-400">Loading skills...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400">No skills found yet. Be the first to offer one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div key={skill.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 text-lg">{skill.skillName}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${levelColor[skill.proficiencyLevel] || 'bg-slate-100 text-slate-600'}`}>
                  {skill.proficiencyLevel}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{skill.description || 'No description provided.'}</p>
              <div className="flex items-center gap-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs">
                  {skill.userFullName?.charAt(0)}
                </div>
                {skill.userFullName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
