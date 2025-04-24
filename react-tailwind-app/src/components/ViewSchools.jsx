import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

const ViewSchools = () => {
  const [schools, setSchools] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [centers, setCenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'desc' });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const [schoolsRes, districtsRes, tehsilsRes, centersRes] = await Promise.all([
        fetch('http://192.168.1.28:8075/api/Schools'),
        fetch('http://192.168.1.28:8075/api/Centers/districts'),
        fetch('http://192.168.1.28:8075/api/Centers/Tehsils'),
        fetch('http://192.168.1.28:8075/api/Centers'),
      ]);

      const [schoolsData, districtsData, tehsilsData, centersData] = await Promise.all([
        schoolsRes.json(),
        districtsRes.json(),
        tehsilsRes.json(),
        centersRes.json(),
      ]);

      setSchools(schoolsData);
      setDistricts(districtsData);
      setTehsils(tehsilsData);
      setCenters(centersData);
    };

    fetchData();
  }, []);

  const resolveName = (id, list) => list.find(item => item.id === id)?.name || 'N/A';

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedSchools = [...schools].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredSchools = sortedSchools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resolveName(school.districtId, districts).toLowerCase().includes(searchQuery.toLowerCase()) ||
    resolveName(school.tehsilId, tehsils).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const exportToCSV = () => {
    const csv = [
      ['School ID', 'Name', 'Address', 'District', 'Tehsil', 'Center', 'Created'],
      ...filteredSchools.map(s =>
        [
          s.schoolId,
          s.name,
          s.address,
          resolveName(s.districtId, districts),
          resolveName(s.tehsilId, tehsils),
          resolveName(s.centerId, centers),
          new Date(s.created).toLocaleString(),
        ]
      ),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'schools.csv';
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">School List</h2>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
            >
              Export CSV
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name, district or tehsil..."
            className="mb-4 w-full px-3 py-2 border rounded"
            value={searchQuery}
            onChange={handleSearch}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 border">#</th>
                  {['schoolId', 'name', 'address', 'districtId', 'tehsilId', 'centerId', 'created'].map((key) => (
                    <th
                      key={key}
                      className="p-3 border cursor-pointer hover:bg-blue-200"
                      onClick={() => handleSort(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace('Id', '')}
                      {sortConfig.key === key ? ` (${sortConfig.direction})` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedSchools.map((school, index) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border">{school.schoolId}</td>
                    <td className="p-3 border">{school.name}</td>
                    <td className="p-3 border">{school.address}</td>
                    <td className="p-3 border">{resolveName(school.districtId, districts)}</td>
                    <td className="p-3 border">{resolveName(school.tehsilId, tehsils)}</td>
                    <td className="p-3 border">{resolveName(school.centerId, centers)}</td>
                    <td className="p-3 border">{new Date(school.created).toLocaleString()}</td>
                  </tr>
                ))}
                {paginatedSchools.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-500">
                      No schools found.
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

export default ViewSchools;
