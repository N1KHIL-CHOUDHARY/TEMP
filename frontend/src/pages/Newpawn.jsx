import { useState, useRef, useEffect } from 'react';
import { getAccounts, createPawnTicket } from '../services/api';

export default function NewPawn() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pawnData, setPawnData] = useState({
    item: '',
    type: '',
    amount: '',
    weight: '',
    purity: '',
    interest: '',
    adv: '',
    photo: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAccounts();
      const mapped = data.map(acc => ({
        id: acc.id,
        name: acc.customer_name || acc.name,
      }));
      setCustomers(mapped);
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPawnData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    const payload = {
      account_id: selectedCustomer,
      pawn_item_type: pawnData.item,
      loan_amount: pawnData.amount,
      adv: pawnData.adv,
      interest: pawnData.interest,
      pawned_date: new Date().toISOString().slice(0, 10),
      status: 'active',
      settled: 0,
      photo: pawnData.photo ? pawnData.photo.name : '',
    };

    const res = await createPawnTicket(payload);
    if (res.success) {
      alert('Pawn ticket created successfully!');
      setPawnData({
        item: '',
        type: '',
        amount: '',
        weight: '',
        purity: '',
        interest: '',
        adv: '',
        photo: null,
      });
      setSelectedCustomer('');
      setCustomerSearch('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert('Failed to create pawn ticket.');
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer.id);
    setCustomerSearch(customer.name);
    setIsDropdownOpen(false);
  };

  const handleRemovePhoto = () => {
    setPawnData((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">New Pawn Ticket</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Search */}
          <div>
            <label className="block text-sm mb-1">Select Customer</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedCustomer('');
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search for a customer..."
              />
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-black rounded-md shadow-lg border border-gray-900 max-h-48 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        className="px-4 py-2 hover:bg-indigo-600 cursor-pointer transition-colors"
                        onClick={() => handleSelectCustomer(c)}
                      >
                        {c.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">No customers found.</div>
                  )}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <p className="mt-2 text-sm text-green-400">Selected: {customerSearch}</p>
            )}
          </div>

          {/* Item Info */}
          <div>
            <label className="block text-sm mb-1">Item Name</label>
            <input
              type="text"
              name="item"
              value={pawnData.item}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Item Type</label>
            <input
              type="text"
              name="type"
              value={pawnData.type}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Numeric Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Weight (g)</label>
              <input
                type="number"
                name="weight"
                value={pawnData.weight}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Purity (%)</label>
              <input
                type="number"
                name="purity"
                value={pawnData.purity}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={pawnData.amount}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                required
              />
            </div>
          </div>

          {/* Interest and Advance Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Interest (%)</label>
              <input
                type="number"
                name="interest"
                value={pawnData.interest}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Advance (₹)</label>
              <input
                type="number"
                name="adv"
                value={pawnData.adv}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-1">Pawn Item Photo (Optional)</label>
            {pawnData.photo ? (
              <div className="relative w-full rounded-md overflow-hidden mb-2">
                <img
                  src={URL.createObjectURL(pawnData.photo)}
                  alt="Pawn item preview"
                  className="w-full h-auto max-h-64 object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <input
                type="file"
                name="photo"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-md font-medium transition-colors"
          >
            Create Pawn Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
