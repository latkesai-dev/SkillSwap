import { useEffect, useState } from 'react';
import { skillApi } from '../api/client';

export default function Profile() {
  const [mine, setMine] = useState({ offered: [], wanted: [] });
  const [offerForm, setOfferForm] = useState({ skillName: '', description: '', proficiencyLevel: 'INTERMEDIATE' });
  const [wantForm, setWantForm] = useState({ skillName: '', description: '' });

  const load = async () => {
  const res = await skillApi.mine();
  console.log(res.data);
  setMine(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submitOffer = async (e) => {
    e.preventDefault();
    await skillApi.offer(offerForm);
    setOfferForm({ skillName: '', description: '', proficiencyLevel: 'INTERMEDIATE' });
    load();
  };

  const submitWant = async (e) => {
    e.preventDefault();
    await skillApi.want(wantForm);
    setWantForm({ skillName: '', description: '' });
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Skills I Offer</h2>
          <form onSubmit={submitOffer} className="space-y-3 mb-5">
            <input
              placeholder="Skill name (e.g. Guitar)" required value={offerForm.skillName}
              onChange={(e) => setOfferForm({ ...offerForm, skillName: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description" value={offerForm.description}
              onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows={2}
            />
            <select
              value={offerForm.proficiencyLevel}
              onChange={(e) => setOfferForm({ ...offerForm, proficiencyLevel: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg">Add Skill</button>
          </form>
          <ul className="space-y-2">
            {(mine.offered || []).map((s) => (
              <li key={s.id} className="text-sm bg-slate-50 rounded-lg px-3 py-2 flex justify-between">
                <span>{s.skillName}</span>
                <span className="text-slate-400">{s.proficiencyLevel}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Skills I Want</h2>
          <form onSubmit={submitWant} className="space-y-3 mb-5">
            <input
              placeholder="Skill name (e.g. Excel)" required value={wantForm.skillName}
              onChange={(e) => setWantForm({ ...wantForm, skillName: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description" value={wantForm.description}
              onChange={(e) => setWantForm({ ...wantForm, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows={2}
            />
            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg">Add Skill</button>
          </form>
          <ul className="space-y-2">
            {(mine.wanted || []).map((s) => (
              <li key={s.id} className="text-sm bg-slate-50 rounded-lg px-3 py-2">{s.skillName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
