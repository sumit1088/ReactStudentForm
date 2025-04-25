import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentForm from "./components/StudentForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import AddCenter from './components/AddCenter';
import ViewCenters from './components/ViewCenters';
import AddSchool from './components/AddSchool';
import ViewSchools from './components/ViewSchools';
import AddTeacher from './components/AddTeacher';
import ViewTeacher from './components/ViewTeacher';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard/masters/center/add" element={<AddCenter />} />
        <Route path="/dashboard/masters/center/view" element={<ViewCenters />} />
        <Route path="/dashboard/masters/school/add" element={<AddSchool />} />
        <Route path="/dashboard/masters/school/view" element={<ViewSchools />} />
        <Route path="/dashboard/masters/teacher/add" element={<AddTeacher />} />
        <Route path="/dashboard/masters/teacher/view" element={<ViewTeacher />} />
        <Route path="/register" element={<StudentForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
