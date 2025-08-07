import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts } from '../services/api';

const STORAGE_KEY = 'cardViewPreference';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [cardView, setCardView] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);

      const data = await getAccounts();

      if (Array.isArray(data)) {
        const mapped = data.map(acc => ({
          ...acc,
          name: acc.customer_name || acc.name,
          phone: acc.phone_no || acc.phone,
          gender: acc.gender || 'N/A', // <-- added this
        }));
        setAccounts(mapped);
      } else {
        setAccounts([]);
        console.error('API response is not an array:', data);
      }
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, cardView);
  }, [cardView]);

  const filtered = accounts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Accounts (Customers)</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 ring-indigo-500"
          />
          <button
            onClick={() => setCardView(!cardView)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm"
          >
            {cardView ? 'Switch to Table View' : 'Switch to Card View'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white/50 py-10">Loading Accounts...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-white/50 py-10">No Accounts found.</div>
      ) : cardView ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow border border-white/10 transition hover:bg-white/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{c.name}</h3>
                <span className="text-sm text-white/40">#{i + 1}</span>
              </div>
              <p className="text-sm"><span className="text-white/60">Phone:</span> {c.phone}</p>
              <p className="text-sm"><span className="text-white/60">Address:</span> {c.address}</p>
              <p className="text-sm"><span className="text-white/60">Gender:</span> {c.gender}</p> {/* added */}
              <div className="mt-3 flex gap-3">
                <Link to={`/Accounts/${c.id}`} className="text-indigo-400 text-sm hover:underline">
                  View Pawns
                </Link>
                <Link to={`/Accounts/update/${c.id}`} className="text-blue-400 text-sm hover:underline">
                  Edit Account
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-x-auto shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10 text-white/70">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Gender</th> {/* added */}
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.address}</td>
                  <td className="px-4 py-3">{c.gender}</td> {/* added */}
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link to={`/Accounts/${c.id}`} className="text-indigo-400 hover:underline">
                      View Pawns
                    </Link>
                    <Link to={`/Accounts/update/${c.id}`} className="text-blue-400 hover:underline">
                      Edit Account
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
