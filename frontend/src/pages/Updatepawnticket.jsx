import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getPawnTicketById, updatePawnTicket } from '../services/api';

export default function UpdatePawn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pawnData, setPawnData] = useState({
    pawned_item: '',
    item_type: '',
    weight: '',
    loan_amount: '',
    purity: '',
    adv_amount: '',
    interest_rate: '',
    pawned_date: '',
    
    photo: null,
  });
  const [initialData, setInitialData] = useState({});
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const customersData = await getAccountById(id);
      const mappedCustomers = customersData.map(acc => ({
        id: acc.id,
        name: acc.customer_name || acc.name,
      }));
      setCustomers(mappedCustomers);

      const pawnTicketData = await getPawnTicketById(id);
      if (pawnTicketData) {
        const ticket = {
          pawned_item: pawnTicketData.pawned_item || '',
          item_type: pawnTicketData.item_type || '',
          weight: pawnTicketData.weight || '',
          loan_amount: pawnTicketData.loan_amount || '',
          purity: pawnTicketData.purity || '',
          adv_amount: pawnTicketData.adv_amount || '',
          interest_rate: pawnTicketData.interest_rate || '',
          pawned_date: pawnTicketData.pawned_date || '',
          photo: pawnTicketData.photo || null,
        };
        setPawnData(ticket);
        setInitialData(ticket);
        setPhotoPreview(pawnTicketData.photo);

        const customer = mappedCustomers.find(c => c.id === pawnTicketData.account_id);
        if (customer) {
          setSelectedCustomer(customer.id);
          setCustomerSearch(customer.name);
        }
      }
    };
    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setPawnData(prev => ({ ...prev, photo: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setPawnData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemovePhoto = () => {
    setPawnData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const isFormModified = () => {
    return JSON.stringify(initialData) !== JSON.stringify(pawnData) ||
           selectedCustomer !== initialData.account_id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormModified()) {
      alert('No changes to save.');
      return;
    }

    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    const payload = {
      account_id: selectedCustomer,
      pawned_item: pawnData.pawned_item,
      item_type: pawnData.item_type,
      weight: pawnData.weight,
      loan_amount: pawnData.loan_amount,
      purity: pawnData.purity,
      adv_amount: pawnData.adv_amount,
      interest_rate: pawnData.interest_rate,
      pawned_date: pawnData.pawned_date,
      photo: pawnData.photo ? pawnData.photo.name : '',
    };

    const res = await updatePawnTicket(id, payload);

    if (res.success) {
      alert('Pawn ticket updated successfully!');
      navigate('/pawns');
    } else {
      alert('Failed to update pawn ticket.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">Update Pawn Ticket</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer */}
          <div ref={dropdownRef}>
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
                <div className="absolute z-10 w-full mt-1 bg-black rounded-md shadow-lg border border-gray-900 max-h-48 overflow-y-auto ">
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

          {/* Pawned Item */}
          <div>
            <label className="block text-sm mb-1">Pawned Item</label>
            <input
              type="text"
              name="pawned_item"
              value={pawnData.pawned_item}
              onChange={handleChange}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              required
            />
          </div>

          {/* Item Type & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Item Type</label>
              <input
                type="text"
                name="item_type"
                value={pawnData.item_type}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Weight (grams)</label>
              <input
                type="number"
                name="weight"
                value={pawnData.weight}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Loan, Purity, Advance, Interest */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                name="loan_amount"
                value={pawnData.loan_amount}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Purity</label>
              <input
                type="text"
                name="purity"
                value={pawnData.purity}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm mb-1">Interest Rate (%)</label>
              <input
                type="number"
                name="interest_rate"
                value={pawnData.interest_rate}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Pawned Date */}
          <div>
            <label className="block text-sm mb-1">Pawned Date</label>
            <input
              type="date"
              name="pawned_date"
              value={pawnData.pawned_date}
              onChange={handleChange}
              className="w-full bg-white/10  text-white px-4 py-2 rounded-md border border-white/20"
              required
            />
          </div>

          {/* Status */}
         

          {/* Photo */}
          <div>
            <label className="block text-sm mb-1">Pawn Item Photo (Optional)</label>
            {photoPreview ? (
              <div className="relative w-full rounded-md overflow-hidden mb-2">
                <img
                  src={photoPreview}
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

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              disabled={!isFormModified()}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
