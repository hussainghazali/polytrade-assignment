import React, { useState, useEffect } from 'react';

export default function Magazine() {
  const [magazines, setMagazines] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the add magazine form
  const [newMagazineData, setNewMagazineData] = useState({
    title: '',
    description: '',
    price: '',
    file: null
  });

  const magazinesPerPage = 3;

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found in session storage');
        }

        const response = await fetch('http://localhost:3001/magazines', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch magazines');
        }

        const responseData = await response.json();
        setMagazines(responseData.data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchMagazines();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const indexOfLastMagazine = currentPage * magazinesPerPage;
  const indexOfFirstMagazine = indexOfLastMagazine - magazinesPerPage;
  const currentMagazines = magazines?.filter(magazine =>
    magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magazine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    magazine.price.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstMagazine, indexOfLastMagazine);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightSearchTerm = (text, term) => {
    const regex = new RegExp(term, 'gi');
    return text.replace(regex, (match) => `<span style="background-color: yellow">${match}</span>`);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

      // Validate if the input is a number
  if (name === 'price' && isNaN(value)) {
    // Show error message or prevent form submission
    return;
  }
  
    setNewMagazineData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewMagazineData(prevData => ({
      ...prevData,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newMagazineData.title);
      formData.append('description', newMagazineData.description);
      formData.append('price', newMagazineData.price);
      formData.append('file', newMagazineData.file);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in session storage');
      }

      const response = await fetch('http://localhost:3001/magazines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add magazine');
      }

      // Reset form data and close the form
      setNewMagazineData({
        title: '',
        description: '',
        price: '',
        file: null
      });
      setShowForm(false);

      // Refetch magazines to update the list
      const updatedMagazinesResponse = await fetch('http://localhost:3001/magazines', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!updatedMagazinesResponse.ok) {
        throw new Error('Failed to fetch updated magazines');
      }

      const updatedMagazinesData = await updatedMagazinesResponse.json();
      setMagazines(updatedMagazinesData.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Magazine</h2>
        <div className="mt-6 flex items-center justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title, description, or price"
            className="px-4 py-2 border rounded-md w-full"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 border rounded-md bg-blue-500 text-white"
          >
            Add Magazine
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {currentMagazines.map((magazine) => (
            <div key={magazine.id} className="p-4 border rounded-md">
              <img
                src={magazine.fileURL}
                className="w-full h-48 object-cover object-center rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2" dangerouslySetInnerHTML={{ __html: highlightSearchTerm(magazine.title, searchTerm) }} />
              <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: highlightSearchTerm(magazine.description, searchTerm) }} />
              <p className="text-gray-700 font-bold mt-2" dangerouslySetInnerHTML={{ __html: highlightSearchTerm('$' + magazine.price, searchTerm) }} />
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
            }`}
          >
            Previous
          </button>
          <div>
            {Array.from({ length: Math.ceil(currentMagazines.length / magazinesPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-4 py-2 rounded-md border ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1 + (currentPage - 1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage === Math.ceil(magazines.length / magazinesPerPage) ? Math.ceil(magazines.length / magazinesPerPage) : currentPage + 1)}
            disabled={currentPage === Math.ceil(magazines.length / magazinesPerPage)}
            className={`px-4 py-2 rounded-md border ${
              currentPage === Math.ceil(magazines.length / magazinesPerPage) ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {/* Add Magazine Form Popup */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Add Magazine</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMagazineData.title}
                  onChange={handleFormChange}
                  required
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newMagazineData.description}
                  onChange={handleFormChange}
                  required
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
  id="price"
  name="price"
  value={newMagazineData.price}
  onChange={handleFormChange}
  required
  className="mt-1 p-2 block w-full border rounded-md"
/>

              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Image File</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  required
                  accept="image/*"
                  className="mt-1 p-2 block w-full border rounded-md"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Magazine</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
