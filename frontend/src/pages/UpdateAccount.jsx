import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState({
    name: '',
    phone: '',
    address: '',
    panNo: '',
    customerPhoto: null,
    introducerPhoto: null,
  });
  const [initialData, setInitialData] = useState({});
  const customerPhotoInputRef = useRef(null);
  const introducerPhotoInputRef = useRef(null);
  const [customerPhotoPreview, setCustomerPhotoPreview] = useState(null);
  const [introducerPhotoPreview, setIntroducerPhotoPreview] = useState(null);

  // Simulate fetching existing account data
  useEffect(() => {
    // In a real application, you would fetch data from an API using the 'id'
    // For this example, we'll use mock data.
    const fetchAccountData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = {
        name: 'Jane Doe',
        phone: '9876543210',
        address: '456 Sample Blvd, City, State',
        panNo: 'ABCDE1234F',
        // In a real app, these would be URLs to the existing photos
        customerPhoto: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Customer',
        introducerPhoto: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Introducer',
      };
      
      setAccountData(mockData);
      setInitialData(mockData);
      setCustomerPhotoPreview(mockData.customerPhoto);
      setIntroducerPhotoPreview(mockData.introducerPhoto);
    };

    fetchAccountData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setAccountData(prev => ({ ...prev, [name]: files[0] }));
      if (name === 'customerPhoto') {
        setCustomerPhotoPreview(URL.createObjectURL(files[0]));
      } else if (name === 'introducerPhoto') {
        setIntroducerPhotoPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setAccountData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemovePhoto = (photoType) => {
    setAccountData(prev => ({ ...prev, [photoType]: null }));
    if (photoType === 'customerPhoto') {
      setCustomerPhotoPreview(null);
      if (customerPhotoInputRef.current) customerPhotoInputRef.current.value = '';
    } else {
      setIntroducerPhotoPreview(null);
      if (introducerPhotoInputRef.current) introducerPhotoInputRef.current.value = '';
    }
  };

  const isFormModified = () => {
    return (
      accountData.name !== initialData.name ||
      accountData.phone !== initialData.phone ||
      accountData.address !== initialData.address ||
      accountData.panNo !== initialData.panNo ||
      accountData.customerPhoto !== initialData.customerPhoto ||
      accountData.introducerPhoto !== initialData.introducerPhoto
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormModified()) {
      alert('No changes to save.');
      return;
    }

    // Add validation for required fields
    if (!accountData.name || !accountData.phone || !accountData.address || !accountData.panNo) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log(`Updating account with ID: ${id}`, accountData);
    alert('Account updated successfully!');
    navigate('/'); // Redirect to a different page after successful update
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
                  name="name"
                  value={accountData.name}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label className="block text-sm mb-1">PAN Number</label>
                <input
                  type="text"
                  name="panNo"
                  value={accountData.panNo}
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Right Column: Photo Uploads */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Photos</h2>
              
              {/* Customer Photo Section */}
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
                      onClick={() => handleRemovePhoto('customerPhoto')}
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
                    name="customerPhoto"
                    ref={customerPhotoInputRef}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                  />
                )}
              </div>
              
              {/* Introducer Photo Section */}
              <div>
                <label className="block text-sm mb-1">Introducer Photo</label>
                {introducerPhotoPreview ? (
                  <div className="relative w-full rounded-md overflow-hidden mb-2">
                    <img
                      src={introducerPhotoPreview}
                      alt="Introducer preview"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto('introducerPhoto')}
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
          
          {/* Submit button spans both columns */}
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
              onClick={() => navigate(-1)} // Go back to the previous page
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