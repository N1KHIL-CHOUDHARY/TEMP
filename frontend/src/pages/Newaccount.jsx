import { useState, useRef } from 'react';
import { createAccount } from '../services/api';

export default function NewAccount() {
  const [accountData, setAccountData] = useState({
    customer_name: '',
    phone_number: '',
    address: '',
    pan_number: '',
    aadhaar_number: '',
    gender: '',
    customer_photo: null,
    introducer_photo: null,
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
    const {
      customer_name,
      phone_number,
      address,
      pan_number,
      aadhaar_number,
      gender,
    } = accountData;

    if (
      !customer_name ||
      !phone_number ||
      !address ||
      !pan_number ||
      !aadhaar_number ||
      !gender
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      customer_name,
      phone_number,
      address,
      pan_number,
      aadhaar_number,
      gender,
      customer_photo: accountData.customer_photo
        ? accountData.customer_photo.name
        : '',
      introducer_photo: accountData.introducer_photo
        ? accountData.introducer_photo.name
        : '',
    };

    const res = await createAccount(payload);
    if (res.success) {
      alert('Account created successfully!');
      setAccountData({
        customer_name: '',
        phone_number: '',
        address: '',
        pan_number: '',
        aadhaar_number: '',
        gender: '',
        customer_photo: null,
        introducer_photo: null,
      });
      if (customerPhotoInputRef.current)
        customerPhotoInputRef.current.value = '';
      if (introducerPhotoInputRef.current)
        introducerPhotoInputRef.current.value = '';
    } else {
      alert('Failed to create account.');
    }
  };

  const handleRemovePhoto = (photoType) => {
    setAccountData((prev) => ({ ...prev, [photoType]: null }));
    if (photoType === 'customer_photo' && customerPhotoInputRef.current) {
      customerPhotoInputRef.current.value = '';
    }
    if (photoType === 'introducer_photo' && introducerPhotoInputRef.current) {
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
                  name="customer_name"
                  value={accountData.customer_name}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={accountData.phone_number}
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
                  name="pan_number"
                  value={accountData.pan_number}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar_number"
                  value={accountData.aadhaar_number}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Gender</label>
                <div className="flex gap-6">
                  {['Male', 'Female', 'Other'].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={accountData.gender === option}
                        onChange={handleChange}
                        className="accent-indigo-500"
                        required
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Photos */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Photos</h2>

              {/* Customer Photo */}
              <div>
                <label className="block text-sm mb-1">Customer Photo (Optional)</label>
                {accountData.customer_photo ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={URL.createObjectURL(accountData.customer_photo)}
                      alt="Customer preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto('customer_photo')}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="customer_photo"
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
                {accountData.introducer_photo ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={URL.createObjectURL(accountData.introducer_photo)}
                      alt="Introducer preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto('introducer_photo')}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    name="introducer_photo"
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
