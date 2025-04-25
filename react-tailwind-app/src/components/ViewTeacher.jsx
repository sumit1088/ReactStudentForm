import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [schools, setSchools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const [teachersRes, centersRes, schoolsRes] = await Promise.all([
        fetch('https://localhost:7020/api/Teachers'),
        fetch('http://192.168.1.28:8075/api/Centers'),
        fetch('http://192.168.1.28:8075/api/Schools'),
      ]);

      const [teachersData, centersData, schoolsData] = await Promise.all([
        teachersRes.json(),
        centersRes.json(),
        schoolsRes.json(),
      ]);

      setTeachers(teachersData);
      setCenters(centersData);
      setSchools(schoolsData);
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

  const sortedTeachers = [...teachers].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredTeachers = sortedTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const exportToCSV = () => {
    const csv = [
      ['ID', 'Name', 'Contact No 1', 'Contact No 2', 'Email', 'Center', 'School'],
      ...filteredTeachers.map(t => [
        t.id,
        t.name,
        t.contactNo1,
        t.contactNo2,
        t.email,
        resolveName(t.centerId, centers),
        resolveName(t.schoolId, schools),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'teachers.csv';
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Teacher List</h2>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
            >
              Export CSV
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            className="mb-4 w-full px-3 py-2 border rounded"
            value={searchQuery}
            onChange={handleSearch}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 border">#</th>
                  {['name', 'contactNo1', 'contactNo2', 'email', 'centerId', 'schoolId'].map((key) => (
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
                {paginatedTeachers.map((teacher, index) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-3 border">{teacher.name}</td>
                    <td className="p-3 border">{teacher.contactNo1}</td>
                    <td className="p-3 border">{teacher.contactNo2}</td>
                    <td className="p-3 border">{teacher.email}</td>
                    <td className="p-3 border">{resolveName(teacher.centerId, centers)}</td>
                    <td className="p-3 border">{resolveName(teacher.schoolId, schools)}</td>
                  </tr>
                ))}
                {paginatedTeachers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No teachers found.
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

export default ViewTeachers;
