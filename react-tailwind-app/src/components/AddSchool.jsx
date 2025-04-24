import React, { useEffect, useState } from "react";
import { fetchCenters, fetchDistricts, fetchTehsils } from '../services/api';
import DashboardLayout from "../components/DashboardLayout"; // adjust the import as needed

const AddSchool = () => {
    const [form, setForm] = useState({
        schoolId: "",
        centerId: "",
        name: "",
        address: "",
        districtId: "",
        tehsilId: "",
        pinCode: "",
        teacherName: "",
        contactNo1: "",
        contactNo2: "",
        email: "",
        password: "",
        state: "Maharashtra"
    });

    const [centers, setCenters] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [tehsils, setTehsils] = useState([]);
    const [filteredTehsils, setFilteredTehsils] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const [centerData, districtData, tehsilData] = await Promise.all([
                fetchCenters(),
                fetchDistricts(),
                fetchTehsils()
            ]);
            setCenters(centerData);
            setDistricts(districtData);
            setTehsils(tehsilData);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (form.districtId) {
            const filtered = tehsils.filter((t) => t.districtId === parseInt(form.districtId));
            setFilteredTehsils(filtered);
        } else {
            setFilteredTehsils([]);
        }
    }, [form.districtId, tehsils]);

    const handleChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate mandatory fields
        if (
            !form.name ||
            !form.address ||
            !form.centerId ||
            !form.teacherName ||
            !form.contactNo1 ||
            !form.email ||
            !form.password
        ) {
            alert("Please fill all required fields marked with *.");
            return;
        }

        // Create payload matching updated .NET model
        const payload = {
            id: 0,
            schoolId: Number(form.schoolId),
            centerId: Number(form.centerId),
            name: form.name,
            address: form.address,
            districtId: Number(form.districtId),
            tehsilId: Number(form.tehsilId),
            state: "Maharashtra",
            pinCode: Number(form.pinCode),
            teacherName: form.teacherName,
            contactNo1: form.contactNo1, // now string
            contactNo2: form.contactNo2, // now string
            email: form.email,
            password: form.password,     // now string
            isDeleted: false,
            created: new Date().toISOString()
        };

        try {
            const response = await fetch("http://192.168.1.28:8075/api/Schools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to submit");

            alert("School added successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error submitting form.");
        }
    };


    return (
        <DashboardLayout>
            <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-center">Add School</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                School Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                required
                                value={form.name}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="address"
                                required
                                value={form.address}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">School ID</label>
                            <input
                                name="schoolId"
                                type="number"
                                value={form.schoolId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Center <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="centerId"
                                required
                                value={form.centerId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Center</option>
                                {centers.map((center) => (
                                    <option key={center.centerId} value={center.centerId}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">District</label>
                            <select
                                name="districtId"
                                value={form.districtId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Taluka (Tehsil)</label>
                            <select
                                name="tehsilId"
                                value={form.tehsilId}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Select Tehsil</option>
                                {filteredTehsils.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">State</label>
                            <input
                                value="Maharashtra"
                                disabled
                                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Pin Code</label>
                            <input
                                name="pinCode"
                                type="number"
                                value={form.pinCode}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Teacher Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="teacherName"
                                required
                                value={form.teacherName}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Contact No 1 <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="contactNo1"
                                type="number"
                                required
                                value={form.contactNo1}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Contact No 2</label>
                            <input
                                name="contactNo2"
                                type="number"
                                value={form.contactNo2}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="w-32 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Add School
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default AddSchool;
