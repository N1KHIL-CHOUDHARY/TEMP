import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccountById, getPawnTicketById } from '../services/api'; // Adjust path as needed

export default function Pawnbyaccount() {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [pawns, setPawns] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusClasses = (status) =>
        status ? 'bg-green-600 text-green-50' : 'bg-red-600 text-red-50';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const accountData = await getAccountById(id);
                const pawnData = await getPawnTicketById(id);

                setAccount(accountData);
                setPawns(pawnData);
                console.log(pawnData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="min-h-screen bg-black text-white p-6 text-center">
                <h1 className="text-3xl font-bold">Account not found.</h1>
                <Link to="/" className="text-blue-400 hover:underline mt-4 block">Go back to dashboard</Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            {/* Account Details */}
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 shadow-xl border border-white/10 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="flex-shrink-0">
                        <img
                            src={account.photo || '/default-avatar.png'} // fallback image
                            alt="Customer"
                            className="w-28 h-28 rounded-full object-cover border-2 border-white/20"
                        />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-3xl font-extrabold">{account.customer_name}</h1>
                        <p className="text-white/70 mt-1">PAN: {account.pan}</p>
                        <p className="text-white/70">Phone: {account.phone_no}</p>
                        <p className="text-white/70">Address: {account.address}</p>
                    </div>
                </div>
            </div>

            {/* Pawn Tickets */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <h2 className="text-2xl font-bold p-6 border-b border-white/10">Pawn Tickets</h2>
                {pawns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-auto">
                            <thead>
                                <tr className="text-left border-b border-white/10 text-white/50">
                                    <th className="py-4 px-6 font-semibold">Bill No</th>
                                    <th className="py-4 px-6 font-semibold">Item</th>
                                    <th className="py-4 px-6 font-semibold hidden sm:table-cell">Amount</th>
                                    <th className="py-4 px-6 font-semibold hidden md:table-cell">ADV</th>
                                    <th className="py-4 px-6 font-semibold hidden md:table-cell">Interest</th>
                                    <th className="py-4 px-6 font-semibold hidden sm:table-cell text-center">Status</th>
                                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pawns.map((pawn) => (
                                    <tr key={pawn.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors duration-150">
                                        <td className="px-6 py-4">{pawn.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{pawn.pawn_item_type}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell font-bold text-white/80">₹{pawn.loan_amount}</td>
                                        <td className="px-6 py-4 hidden md:table-cell text-white/80">₹{pawn.adv}</td>
                                        <td className="px-6 py-4 hidden md:table-cell text-white/80">{pawn.interest}%</td>
                                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClasses(pawn.status === 'active')}`}>
                                                {pawn.status === 'active' ? 'Active' : 'Closed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/pawns/${pawn.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 text-center text-white/50">
                        <p>No pawn tickets found for this account.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
