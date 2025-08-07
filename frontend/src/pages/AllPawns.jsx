
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPawnTickets } from '../services/api';

const STORAGE_KEY = 'cardViewPreferencePawn';

export default function AllPawns() {
  const [pawns, setPawns] = useState([]);
  const [search, setSearch] = useState('');
  const [cardView, setCardView] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPawns = async () => {
      setLoading(true);
      let status = '';
      if (filterStatus === 'active') status = 'active';
      if (filterStatus === 'closed') status = 'closed';
      const data = await getPawnTickets(status);
      // Map backend fields to frontend
      const mapped = data.map(p => ({
        ...p,
        item: p.pawn_item_type || p.item,
        amount: p.loan_amount || p.amount,
        weight: p.weight || '',
        purity: p.purity || '',
        status: p.status === 'active',
        billNo: p.id,
        customerName: p.customer_name || '',
      }));
      setPawns(mapped);
      setLoading(false);
    };
    fetchPawns();
  }, [filterStatus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, cardView);
  }, [cardView]);

  const filtered = pawns.filter(p =>
    p.item.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === 'all' ||
      (filterStatus === 'active' && p.status) ||
      (filterStatus === 'closed' && !p.status))
  );

// Tailwind CSS classes for the status badge
const statusClasses = (status) =>
  status
   ? 'bg-green-600 text-green-50'
   : 'bg-red-600 text-red-50'

return (
  <div className="min-h-screen bg-black text-white p-6 md:p-8">
   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
     <h1 className="text-4xl font-extrabold text-white">All Pawns</h1>
<div className="flex flex-wrap gap-4">
   <input
     type="text"
     placeholder="Search items..."
     value={search}
     onChange={(e) => setSearch(e.target.value)}
     className="px-4 py-2 bg-white/10 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 w-full md:w-auto"
   />

   <select
     className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
     value={filterStatus}
     onChange={(e) => setFilterStatus(e.target.value)}
   >
     <option value="all" className="bg-black">All</option>
     <option value="active" className="bg-black">Active</option>
     <option value="closed" className="bg-black">Closed</option>
   </select>

   <button
     onClick={() => setCardView(!cardView)}
     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors duration-200"
   >
     {cardView ? 'Switch To Table View' : 'Switch To Card View'}
   </button>
     </div>
   </div>

   {cardView ? (
     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
   {filtered.map((p) => (
     <div key={p.id} className="bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-center mb-3">
      <h3 className="font-extrabold text-2xl tracking-wide">{p.item}</h3>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClasses(p.status)}`}>
        {p.status ? 'Active' : 'Closed'}
      </span>
      </div>
      <div className="text-sm space-y-1 text-white/70">
      <p><strong>Bill No:</strong> {p.billNo}</p>
      <p><strong>Amount:</strong> ₹{p.amount.toLocaleString()}</p>
      <p><strong>Weight:</strong> {p.weight} g</p>
      <p><strong>Purity:</strong> {p.purity}%</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-white/10">
      <Link to={`/Accounts/${p.account_id}`} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200">
      View Details →
      </Link>
    </div>
     </div>
   ))}
     </div>
   ) : (
     <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
   <table className="w-full text-sm table-auto">
     <thead>
    <tr className="text-left border-b border-white/10 text-white/50">
      <th className="py-4 px-6 font-semibold">Bill No</th>
      <th className="py-4 px-6 font-semibold">Item</th>
      <th className="py-4 px-6 font-semibold hidden md:table-cell">Weight</th>
      <th className="py-4 px-6 font-semibold hidden md:table-cell">Purity</th>
      <th className="py-4 px-6 font-semibold">Amount</th>
      <th className="py-4 px-6 font-semibold text-center hidden sm:table-cell">Status</th>
      <th className="py-4 px-6 font-semibold text-right">Actions</th>
    </tr>
     </thead>
     <tbody>
    {filtered.length > 0 ? (
      filtered.map((p) => (
      <tr key={p.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors duration-150">
        <td className="px-6 py-4">{p.billNo}</td>
        <td className="px-6 py-4 font-medium text-white">{p.item}</td>
        <td className="px-6 py-4 hidden md:table-cell text-white/80">{p.weight} g</td>
        <td className="px-6 py-4 hidden md:table-cell text-white/80">{p.purity}%</td>
        <td className="px-6 py-4 font-bold">₹{p.amount.toLocaleString()}</td>
        <td className="px-6 py-4 text-center hidden sm:table-cell">
         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClasses(p.status)}`}>
           {p.status ? 'Active' : 'Closed'}
         </span>
        </td>
        <td className="px-6 py-4 text-right">
         <Link to={`/pawns/${p.id}/edit`} className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium">
           View
         </Link>
        </td>
      </tr>
      ))
    ) : (
      <tr>
      <td colSpan={7} className="text-center py-8 text-white/50">
        No pawn records found.
      </td>
      </tr>
    )}
     </tbody>
   </table>
     </div>
   )}
  </div>
)
}