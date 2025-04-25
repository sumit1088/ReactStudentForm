import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { fetchCenters, fetchSchools } from '../services/api';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

const AddTeacher = () => {
    const [centers, setCenters] = useState([]);
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [form, setForm] = useState({
        centerId: '',
        schoolId: '',
        teachers: [
            { name: '', contactNo1: '', contactNo2: '', email: '' },
        ],
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const centerData = await fetchCenters();
            const schoolData = await fetchSchools();
            setCenters(centerData);
            setSchools(schoolData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (form.centerId) {
            const filtered = schools.filter(s => s.centerId === parseInt(form.centerId));
            setFilteredSchools(filtered);
        } else {
            setFilteredSchools([]);
        }
    }, [form.centerId, schools]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTeacherChange = (index, field, value) => {
        const updatedTeachers = [...form.teachers];
        updatedTeachers[index][field] = value;
        setForm(prev => ({ ...prev, teachers: updatedTeachers }));
    };

    const handleTeacherBlur = (index, field) => {
        const value = form.teachers[index][field];
        const updatedErrors = [...errors];
        if (!updatedErrors[index]) updatedErrors[index] = {};

        if (field === 'contactNo1' || field === 'contactNo2') {
            const isValid = /^\d{10,11}$/.test(value);
            updatedErrors[index][field] = isValid ? '' : 'Contact number must be 10 or 11 digits';
        } else if (field === 'email') {
            const isValid = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value);
            updatedErrors[index][field] = isValid || value === '' ? '' : 'Invalid email format';
        }

        setErrors(updatedErrors);
    };

    const addTeacherRow = () => {
        const last = form.teachers[form.teachers.length - 1];
        if (!last.name || !last.contactNo1) {
            alert("Please fill in the required fields before adding a new row.");
            return;
        }
        setForm(prev => ({
            ...prev,
            teachers: [...prev.teachers, { name: '', contactNo1: '', contactNo2: '', email: '' }],
        }));
    };

    const deleteTeacherRow = (index) => {
        const updatedTeachers = form.teachers.filter((_, i) => i !== index);
        setForm(prev => ({ ...prev, teachers: updatedTeachers }));
        setErrors(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { centerId, schoolId, teachers } = form;

        if (!centerId || !schoolId) {
            alert("Please select a center and a school");
            return;
        }

        // Validate required teacher fields (name and contactNo1 only)
        const isValid = teachers.every(t =>
            t.name?.trim() &&
            /^\d{10,11}$/.test(t.contactNo1)
        );

        if (!teachers || teachers.length === 0 || !isValid) {
            alert("Please fill all required teacher fields correctly");
            return;
        }

        const formattedTeachers = teachers.map(t => ({
            id: 0,  // Assuming the backend auto-generates this
            name: t.name,
            contactNo1: t.contactNo1,
            contactNo2: t.contactNo2 || '', // Optional
            email: t.email || '',          // Optional
            centerId: parseInt(centerId),
            schoolId: parseInt(schoolId)
        }));

        try {
            const response = await fetch('https://localhost:7020/api/Teachers/Bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify(formattedTeachers),
            });

            if (response.ok) {
                alert("Teachers added successfully!");
                setForm({
                    centerId: '',
                    schoolId: '',
                    teachers: [{ name: '', contactNo1: '', contactNo2: '', email: '' }]
                });
                setErrors([]);
            } else {
                alert("Error submitting teachers");
            }
        } catch (error) {
            console.error(error);
            alert("Error occurred while submitting data.");
        }
    };



    return (
        <DashboardLayout>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Add Bulk Teacher</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="font-medium text-sm">Center <span className="text-red-500">*</span></label>
                            <select
                                name="centerId"
                                value={form.centerId}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded mt-1"
                            >
                                <option value="">Select Center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.id}>{center.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-medium text-sm">School <span className="text-red-500">*</span></label>
                            <select
                                name="schoolId"
                                value={form.schoolId}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded mt-1"
                            >
                                <option value="">Select School</option>
                                {filteredSchools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border rounded-lg overflow-x-auto mt-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Teacher Name <span className="text-red-500">*</span></th>
                                    <th className="p-3 border">Contact 1 <span className="text-red-500">*</span></th>
                                    <th className="p-3 border">Contact 2</th>
                                    <th className="p-3 border">Email ID</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.teachers.map((teacher, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3 border">{index + 1}</td>
                                        <td className="p-3 border">
                                            <input
                                                type="text"
                                                value={teacher.name}
                                                onChange={e => handleTeacherChange(index, 'name', e.target.value)}
                                                placeholder="Teacher Name"
                                                className="w-full border px-2 py-1 rounded"
                                            />
                                        </td>
                                        <td className="p-3 border">
                                            <input
                                                type="text"
                                                value={teacher.contactNo1}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (/^\d{0,11}$/.test(val)) {
                                                        handleTeacherChange(index, 'contactNo1', val);
                                                    }
                                                }}
                                                onBlur={() => handleTeacherBlur(index, 'contactNo1')}
                                                className="w-full border px-2 py-1 rounded"
                                            />
                                            {errors[index]?.contactNo1 && (
                                                <p className="text-red-500 text-xs mt-1">{errors[index].contactNo1}</p>
                                            )}

                                        </td>
                                        <td className="p-3 border">
                                            <input
                                                type="text"
                                                value={teacher.contactNo2}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (/^\d{0,11}$/.test(val)) {
                                                        handleTeacherChange(index, 'contactNo2', val);
                                                    }
                                                }}
                                                onBlur={() => handleTeacherBlur(index, 'contactNo2')}
                                                className="w-full border px-2 py-1 rounded"
                                            />
                                            {errors[index]?.contactNo2 && (
                                                <p className="text-red-500 text-xs mt-1">{errors[index].contactNo2}</p>
                                            )}

                                        </td>
                                        <td className="p-3 border">
                                            <input
                                                type="email"
                                                value={teacher.email}
                                                onChange={e => handleTeacherChange(index, 'email', e.target.value)}
                                                onBlur={() => handleTeacherBlur(index, 'email')}
                                                placeholder="Email ID"
                                                className="w-full border px-2 py-1 rounded"
                                            />
                                            {errors[index]?.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors[index].email}</p>
                                            )}
                                        </td>
                                        <td className="p-3 border text-center">
                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteTeacherRow(index)}
                                                    className="text-red-600 hover:scale-110 transition-transform"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 flex items-center">
                        <button
                            type="button"
                            onClick={addTeacherRow}
                            className="text-green-600 text-xl hover:scale-110 transition-transform"
                        >
                            <FaPlusCircle />
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full"
                        >
                            CREATE BULK TEACHER
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AddTeacher;
