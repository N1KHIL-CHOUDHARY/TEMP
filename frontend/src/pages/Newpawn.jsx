import { useState, useRef, useEffect } from 'react';
import { getAccounts, createPawnTicket } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function NewPawn() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pawnData, setPawnData] = useState({
    pawned_item: '',
    item_type: 'gold',
    loan_amount: '',
    weight: '',
    purity: '',
    interest_rate: '',
    adv_amount: '',
    pawned_date: '',
    photo: null,
  });

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAccounts();
      if (Array.isArray(data)) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      pawned_item: pawnData.pawned_item || null,
      item_type: pawnData.item_type,
      loan_amount: parseFloat(pawnData.loan_amount) || 0,
      weight: parseFloat(pawnData.weight) || 0,
      purity: parseFloat(pawnData.purity) || 0,
      interest_rate: parseFloat(pawnData.interest_rate) || 0,
      adv_amount: parseFloat(pawnData.adv_amount) || 0,
      pawned_date: pawnData.pawned_date,
      account_id: selectedCustomer,
      status: 'active',
      photo: pawnData.photo ? pawnData.photo.name : null,
    };

    const res = await createPawnTicket(payload);
    if (res.success) {
      alert('Pawn ticket created successfully!');
      navigate('/pawns');
    } else {
      alert('Failed to create pawn ticket.');
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name.toLowerCase().includes(customerSearch.trim().toLowerCase())
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer.account_id);
    setCustomerSearch(customer.customer_name);
    setIsDropdownOpen(false);
  };

  const handleRemovePhoto = () => {
    setPawnData((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">New Pawn Ticket</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Select Customer</label>
            <div className="relative" ref={dropdownRef}>
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
                        key={c.account_id}
                        className="px-4 py-2 hover:bg-indigo-600 cursor-pointer transition-colors"
                        onClick={() => handleSelectCustomer(c)}
                      >
                        {c.customer_name}
                      </div>
                    ))
                  ) : (
                    <div
                      className="px-4 py-2 text-gray-400 cursor-pointer"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      No customers found.
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <p className="mt-2 text-sm text-green-400">Selected: {customerSearch}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Item Name</label>
            <input
              type="text"
              name="pawned_item"
              value={pawnData.pawned_item}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Item Type</label>
            <select
              name="item_type"
              value={pawnData.item_type}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              required
            >
              <option value="gold" className="bg-black">Gold</option>
              <option value="silver" className="bg-black">Silver</option>
              <option value="copper" className="bg-black">Copper</option>
              <option value="others" className="bg-black">Others</option>
            </select>
          </div>

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
                name="loan_amount"
                value={pawnData.loan_amount}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Interest (%)</label>
              <input
                type="number"
                name="interest_rate"
                value={pawnData.interest_rate}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Advance (₹)</label>
              <input
                type="number"
                name="adv_amount"
                value={pawnData.adv_amount}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Pawned Date</label>
            <input
              type="date"
              name="pawned_date"
              value={pawnData.pawned_date}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

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
                  ✕
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