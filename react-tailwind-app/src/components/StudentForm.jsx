import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import { fetchCenters, fetchSchools, submitStudent } from '../services/api';

const classOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const StudentForm = () => {
    const [form, setForm] = useState({
        surname: '',
        firstname: '',
        lastname: '',
        birthDate: '',
        gender: '',
        mobile: '',
        schoolId: '',
        centerId: '',
        className: '',
    });

    const [schools, setSchools] = useState([]);
    const [centers, setCenters] = useState([]);

    useEffect(() => {
        fetchSchools().then(setSchools);
        fetchCenters().then(setCenters);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`${name}: ${value}`); // ✅ see changes live
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitStudent(form);
            alert('Student registered!');
            setForm({
                surname: '',
                firstname: '',
                lastname: '',
                birthDate: '',
                gender: '',
                mobile: '',
                schoolId: '',
                centerId: '',
                className: '',
            });
        } catch (err) {
            console.error(err);
            alert('Failed to submit. Check the console for more info.');
        }
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 py-10">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
                    Student Registration Form
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Please fill in all the required information
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="surname" className="font-medium text-gray-700 mb-1">
                                Surname <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={form.surname}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="firstname" className="font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={form.firstname}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lastname" className="font-medium text-gray-700 mb-1">
                                Middle Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="birthDate" className="font-medium text-gray-700 mb-1">Birth Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={form.birthDate}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <label key={g} className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={form.gender === g}
                                            onChange={handleChange}
                                            required
                                        />
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="mobile" className="font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                required
                                placeholder=""
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <Dropdown
                            name="schoolId"
                            label="School"
                            options={schools}
                            isObject={true}
                            onChange={handleChange}
                            value={form.schoolId}
                        />

                        <Dropdown
                            name="centerId"
                            label="Center"
                            options={centers}
                            isObject={true}
                            onChange={handleChange}
                            value={form.centerId}
                        />


                        <Dropdown
                            name="className"
                            label="Class"
                            options={classOptions}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-center mt-10">
                        <button
                            type="submit"
                            className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
                        >
                            Submit Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
