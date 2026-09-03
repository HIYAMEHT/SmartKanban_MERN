import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { BoardDetails } from './pages/BoardDetails';
import { Tasks } from './pages/Tasks';
import { TimeTracking } from './pages/TimeTracking';
import { Analytics } from './pages/Analytics';
import { Workload } from './pages/Workload';
import { Recommendations } from './pages/Recommendations';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/boards/:boardId" element={<BoardDetails />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/workload" element={<Workload />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
