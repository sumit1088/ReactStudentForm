import React, { useEffect, useState } from 'react';
import DashboardLayout from "./DashboardLayout";

const ViewCenters = () => {
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'desc' });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCenters = async () => {
      const res = await fetch('http://192.168.1.28:8075/api/Centers');
      const data = await res.json();
      setCenters(data);
    };
    fetchCenters();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedCenters = [...centers].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCenters = sortedCenters.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.tehsilName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCenters = filteredCenters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);

  const exportToCSV = () => {
    const csv = [
      ['Center ID', 'Name', 'Address', 'District', 'Taluka', 'Created'],
      ...filteredCenters.map(c =>
        [c.centerId, c.name, c.address, c.districtName, c.tehsilName, new Date(c.created).toLocaleString()]
      )
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'centers.csv';
    link.click();
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Center List</h2>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
          >
            Export CSV
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name, district or taluka..."
          className="mb-4 w-full px-3 py-2 border rounded"
          value={searchQuery}
          onChange={handleSearch}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border">#</th>
                {['centerId', 'name', 'address', 'districtName', 'tehsilName', 'created'].map((key, idx) => (
                  <th
                    key={key}
                    className="p-3 border cursor-pointer hover:bg-blue-200"
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('Name', '')}
                    {sortConfig.key === key ? ` (${sortConfig.direction})` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCenters.map((center, index) => (
                <tr key={center.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-3 border">{center.centerId}</td>
                  <td className="p-3 border">{center.name}</td>
                  <td className="p-3 border">{center.address}</td>
                  <td className="p-3 border">{center.districtName}</td>
                  <td className="p-3 border">{center.tehsilName}</td>
                  <td className="p-3 border">{new Date(center.created).toLocaleString()}</td>
                </tr>
              ))}
              {paginatedCenters.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No centers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ViewCenters;
