const API_BASE = 'http://192.168.1.28:8075/api';

export const fetchSchools = async () => {
  const res = await fetch(`${API_BASE}/Schools`);
  return res.json();
};

export const fetchCenters = async () => {
  const res = await fetch(`${API_BASE}/Centers`);
  return res.json();
};

export const submitStudent = async (studentData) => {
  await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
};

// ✅ New API to fetch Districts
export const fetchDistricts = async () => {
  const res = await fetch(`${API_BASE}/Centers/districts`);
  return res.json();
};

// ✅ New API to fetch Tehsils
export const fetchTehsils = async () => {
  const res = await fetch(`${API_BASE}/Centers/tehsils`);
  return res.json();
};
