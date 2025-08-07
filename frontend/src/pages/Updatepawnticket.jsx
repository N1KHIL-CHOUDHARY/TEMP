import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockCustomers = [
  { id: '1', name: 'Amit Singh' },
  { id: '2', name: 'Priya Mehta' },
  { id: '3', name: 'Rahul Jain' },
  { id: '4', name: 'Sonal Sharma' },
  { id: '5', name: 'Kumar Patel' },
  { id: '6', name: 'Anjali Desai' },
  { id: '7', name: 'Vikram Choudhury' },
  { id: '8', name: 'Neha Gupta' },
  { id: '9', name: 'Ravi Verma' },
  { id: '10', name: 'Deepika Rao' },
];

export default function UpdatePawn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pawnData, setPawnData] = useState({
    item: '',
    type: '',
    amount: '',
    weight: '',
    purity: '',
    photo: null,
  });
  const [initialData, setInitialData] = useState({});
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch data from an API using the 'id'
    const fetchPawnData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPawnData = {
        item: 'Gold Necklace',
        type: 'Jewellery',
        amount: 50000,
        weight: 25.5,
        purity: 91.6,
        // In a real app, this would be a URL to the existing photo
        photo: 'https://via.placeholder.com/200/FFD700/000000?text=Pawn+Item',
        customerId: '2', // Mock customer ID
      };
      
      const customer = mockCustomers.find(c => c.id === mockPawnData.customerId);
      if (customer) {
        setSelectedCustomer(customer.id);
        setCustomerSearch(customer.name);
      }
      
      // Separate the photo URL from the rest of the data for comparison
      const { photo: photoUrl, ...restData } = mockPawnData;
      setPawnData({ ...restData, photo: photoUrl });
      setInitialData({ ...restData, photo: photoUrl });
      setPhotoPreview(photoUrl);
    };

    fetchPawnData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setPawnData(prev => ({ ...prev, [name]: files[0] }));
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

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer.id);
    setCustomerSearch(customer.name);
    setIsDropdownOpen(false);
  };
  
  const isFormModified = () => {
    const isCustomerModified = selectedCustomer !== initialData.customerId;
    const isItemModified = (
      pawnData.item !== initialData.item ||
      pawnData.type !== initialData.type ||
      pawnData.amount !== initialData.amount ||
      pawnData.weight !== initialData.weight ||
      pawnData.purity !== initialData.purity ||
      pawnData.photo !== initialData.photo
    );
    return isCustomerModified || isItemModified;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormModified()) {
      alert('No changes to save.');
      return;
    }
    
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    
    // In a real app, you'd send this data to your API
    console.log(`Updating pawn ticket with ID: ${id}`, { customer: selectedCustomer, ...pawnData });
    alert('Pawn ticket updated successfully!');
    navigate('/pawns'); // Redirect to a different page after successful update
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur shadow space-y-6">
        <h1 className="text-2xl font-bold">Update Pawn Ticket</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Weight (g)</label>
              <input
                type="number"
                name="weight"
                value={pawnData.weight}
                onChange={handleChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
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