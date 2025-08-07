import { useState, useRef } from 'react';
import { createAccount } from '../services/api';

export default function NewAccount() {
  const [accountData, setAccountData] = useState({
    name: '',
    phone: '',
    address: '',
    panNo: '',
    aadhaar: '',
    customerPhoto: null,
    introducerPhoto: null,
  });

  const customerPhotoInputRef = useRef(null);
  const introducerPhotoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAccountData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, panNo, aadhaar } = accountData;
    if (!name || !phone || !address || !panNo || !aadhaar) {
      alert('Please fill in all required fields.');
      return;
    }

    // Map frontend fields to backend fields
    const payload = {
      customer_name: name,
      phone_no: phone,
      address,
      pan: panNo,
      aadhaar: aadhaar,
      photo: accountData.customerPhoto ? accountData.customerPhoto.name : '',
    };

    const res = await createAccount(payload);
    if (res.success) {
      alert('Account created successfully!');
      setAccountData({
        name: '',
        phone: '',
        address: '',
        panNo: '',
        aadhaar: '',
        customerPhoto: null,
        introducerPhoto: null,
      });
      if (customerPhotoInputRef.current) customerPhotoInputRef.current.value = '';
      if (introducerPhotoInputRef.current) introducerPhotoInputRef.current.value = '';
    } else {
      alert('Failed to create account.');
    }
  };

  const handleRemovePhoto = (photoType) => {
    setAccountData((prev) => ({ ...prev, [photoType]: null }));
    if (photoType === 'customerPhoto' && customerPhotoInputRef.current) {
      customerPhotoInputRef.current.value = '';
    }
    if (photoType === 'introducerPhoto' && introducerPhotoInputRef.current) {
      introducerPhotoInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">Create New Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Customer Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customer Details</h2>
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={accountData.name}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={accountData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={accountData.address}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">PAN Number</label>
                <input
                  type="text"
                  name="panNo"
                  value={accountData.panNo}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={accountData.aadhaar}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Right Column: Photos */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Photos</h2>

              {/* Customer Photo */}
              <div>
                <label className="block text-sm mb-1">Customer Photo (Optional)</label>
                {accountData.customerPhoto ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={URL.createObjectURL(accountData.customerPhoto)}
                      alt="Customer preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto('customerPhoto')}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="customerPhoto"
                    ref={customerPhotoInputRef}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                )}
              </div>

              {/* Introducer Photo */}
              <div>
                <label className="block text-sm mb-1">Introducer Photo (Optional)</label>
                {accountData.introducerPhoto ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={URL.createObjectURL(accountData.introducerPhoto)}
                      alt="Introducer preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto('introducerPhoto')}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="introducerPhoto"
                    ref={introducerPhotoInputRef}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-md font-medium transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
    