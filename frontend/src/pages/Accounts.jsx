import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts, deleteAccount } from '../services/api';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const STORAGE_KEY = 'cardViewPreference';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [cardView, setCardView] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const data = await getAccounts();
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error('API response is not an array:', data);
        setAccounts([]);
      }
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      const result = await deleteAccount(id);
      if (result.success) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== id));
        alert('Account deleted successfully.');
      } else {
        alert('Failed to delete account.');
      }
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, cardView);
  }, [cardView]);

  const filtered = accounts.filter((acc) =>
    acc.customer_name?.toLowerCase().includes(search.toLowerCase())
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
          {filtered.map((account, index) => (
            <div
              key={account.id?.toString()}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow border border-white/10 transition hover:bg-white/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{account.customer_name || 'Unnamed'}</h3>
                <span className="text-sm text-white/40">#{index + 1}</span>
              </div>
              <p className="text-sm"><span className="text-white/60">Phone:</span> {account.phone_number || 'N/A'}</p>
              <p className="text-sm"><span className="text-white/60">Address:</span> {account.address || 'N/A'}</p>
              <div className="mt-3 flex gap-3 items-center">
                <Link to={`/accounts/${account.account_id}`} className="text-indigo-400 text-sm hover:underline flex items-center gap-1">
                  <FaEye /> View Pawns
                </Link>
                <Link to={`/accounts/update/${account.account_id}`} className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                  <FaEdit /> Edit
                </Link>
                <button onClick={() => handleDelete(account.account_id)} className="text-red-400 text-sm hover:underline flex items-center gap-1">
                  <FaTrash /> Delete
                </button>
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
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account, index) => (
                <tr
                  key={account.id?.toString()}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{account.customer_name || 'Unnamed'}</td>
                  <td className="px-4 py-3">{account.phone_number || 'N/A'}</td>
                  <td className="px-4 py-3">{account.address || 'N/A'}</td>
                  <td className="px-4 py-3 text-center space-x-4">
                    <Link to={`/accounts/${account.account_id}`} className="text-indigo-400 hover:underline">
                      View Pawns
                    </Link>
                    <Link to={`/accounts/update/${account.account_id}`} className="text-blue-400 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(account.account_id)} className="text-red-400 hover:underline">
                      Delete
                    </button>
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
