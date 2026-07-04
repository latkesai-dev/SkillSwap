import { useEffect, useState } from 'react';
import { matchApi, sessionApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MyMatches() {
  const { user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState({});
  const [sessionForm, setSessionForm] = useState({});

  const load = async () => {
    try {
      const res = await matchApi.myMatches();
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    try {
      await matchApi.updateStatus(id, status);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update match.");
    }
  };

  const loadSessions = async (matchId) => {
    try {
      const res = await sessionApi.getForMatch(matchId);
      setSessions((prev) => ({
        ...prev,
        [matchId]: res.data,
      }));
    } catch (err) {
      console.error(err);
      alert("Unable to load sessions.");
    }
  };

  const bookSession = async (matchId) => {
    try {
      const form = sessionForm[matchId] || {};

      await sessionApi.book({
        matchId,
        ...form,
      });

      loadSessions(matchId);

      setSessionForm((prev) => ({
        ...prev,
        [matchId]: {
          scheduledAt: "",
          notes: "",
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Unable to book session.");
    }
  };

  const statusColor = {
    PENDING: 'bg-amber-100 text-amber-700',
    ACCEPTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-slate-200 text-slate-700',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-1">
        My Matches
      </h1>

      <p className="text-slate-500 mb-8">
        Mutual skill trades waiting for action.
      </p>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : matches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
          No matches yet. Go to your Dashboard and click
          <strong> Find New Matches</strong>.
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const isUserA = m.userAId === user.id;

            const otherName = isUserA
              ? m.userBName
              : m.userAName;

            const youTeach = isUserA
              ? m.skillFromAToB
              : m.skillFromBToA;

            const theyTeach = isUserA
              ? m.skillFromBToA
              : m.skillFromAToB;

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {otherName}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      You teach{" "}
                      <span className="font-medium text-brand-700">
                        {youTeach}
                      </span>{" "}
                      ⇄ They teach{" "}
                      <span className="font-medium text-brand-700">
                        {theyTeach}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[m.status]}`}
                    >
                      {m.status}
                    </span>

                    {m.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            respond(m.id, "ACCEPTED")
                          }
                          className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            respond(m.id, "REJECTED")
                          }
                          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {m.status === "ACCEPTED" && (
                  <div className="mt-5 border-t border-slate-200 pt-4">

                    <button
                      onClick={() => loadSessions(m.id)}
                      className="text-sm text-brand-600 underline mb-4"
                    >
                      View Sessions
                    </button>

                    {sessions[m.id] && (
                      <ul className="space-y-2 mb-4">
                        {sessions[m.id].map((s) => (
                          <li
                            key={s.id}
                            className="bg-slate-50 rounded-lg px-3 py-2"
                          >
                            <div className="flex justify-between">
                              <span>{new Date(s.scheduledAt).toLocaleString()}</span>
                              <span className="text-slate-500">{s.status}</span>
                            </div>

                            {s.notes && (
                              <p className="text-sm text-slate-600 mt-1">
                                Notes: {s.notes}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-col md:flex-row gap-2">

                      <input
                        type="datetime-local"
                        value={
                          sessionForm[m.id]?.scheduledAt || ""
                        }
                        onChange={(e) =>
                          setSessionForm((prev) => ({
                            ...prev,
                            [m.id]: {
                              ...prev[m.id],
                              scheduledAt: e.target.value,
                            },
                          }))
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      />

                      <input
                        type="text"
                        placeholder="Notes"
                        value={
                          sessionForm[m.id]?.notes || ""
                        }
                        onChange={(e) =>
                          setSessionForm((prev) => ({
                            ...prev,
                            [m.id]: {
                              ...prev[m.id],
                              notes: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      />

                      <button
                        onClick={() => bookSession(m.id)}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Book Session
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}