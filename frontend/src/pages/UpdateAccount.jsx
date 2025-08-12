import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccountById, updateAccount } from '../services/api';

export default function UpdateAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState({
    customer_name: '',
    phone_number: '',
    address: '',
    pan_number: '',
    aadhaar_number: '',
    gender: '',
    customer_photo: null,
  });
  const [initialData, setInitialData] = useState({});
  const customerPhotoInputRef = useRef(null);
  const [customerPhotoPreview, setCustomerPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      const data = await getAccountById(id);
      if (data) {
        setAccountData({
          customer_name: data.customer_name || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          pan_number: data.pan_number || '',
          aadhaar_number: data.aadhaar_number || '',
          gender: data.gender || '',
          customer_photo: data.customer_photo || null,
        });
        setInitialData({
          customer_name: data.customer_name || '',
          phone_number: data.phone_number || '',
          address: data.address || '',
          pan_number: data.pan_number || '',
          aadhaar_number: data.aadhaar_number || '',
          gender: data.gender || '',
          customer_photo: data.customer_photo || null,
        });
        setCustomerPhotoPreview(data.customer_photo);
      }
    };
    fetchAccountData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setAccountData(prev => ({ ...prev, [name]: files[0] }));
      setCustomerPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setAccountData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemovePhoto = () => {
    setAccountData(prev => ({ ...prev, customer_photo: null }));
    setCustomerPhotoPreview(null);
    if (customerPhotoInputRef.current) customerPhotoInputRef.current.value = '';
  };

  const isFormModified = () => {
    return (
      accountData.customer_name !== initialData.customer_name ||
      accountData.phone_number !== initialData.phone_number ||
      accountData.address !== initialData.address ||
      accountData.pan_number !== initialData.pan_number ||
      accountData.aadhaar_number !== initialData.aadhaar_number ||
      accountData.gender !== initialData.gender ||
      accountData.customer_photo !== initialData.customer_photo
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormModified()) {
      alert('No changes to save.');
      return;
    }

    if (!accountData.customer_name || !accountData.phone_number || !accountData.address || !accountData.pan_number || !accountData.aadhaar_number || !accountData.gender) {
      alert('Please fill in all required fields.');
      return;
    }

    const res = await updateAccount(id, accountData);

    if (res.success) {
      alert('Account updated successfully!');
      navigate('/accounts');
    } else {
      alert('Failed to update account.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">Update Account</h1>

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
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Pan Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={accountData.pan_number}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            {/* Right Column: Photo Uploads */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Photos</h2>
              <div>
                <label className="block text-sm mb-1">Customer Photo</label>
                {customerPhotoPreview ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={customerPhotoPreview}
                      alt="Customer preview"
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
                    name="customer_photo"
                    ref={customerPhotoInputRef}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 pt-4 flex space-x-4">
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
