import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Employee from "./pages/Dashboard/Employee";
import Department from "./pages/Dashboard/Department";
import Position from "./pages/Dashboard/Position";
import Leave from "./pages/Dashboard/Leave";
import { useEffect } from "react";
import { ThemeProvider } from './hooks/ThemeContext';
import LoginPage from "./features/auth/LoginPage";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import NotAuthorized from "./pages/OtherPage/NotAuthorized";
import RegisterPage from "./features/auth/RegisterPage";

export default function App() {
  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Admin-only Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Department />} />
            <Route path="/department" element={<Department />} />
            <Route path="/position" element={<Position />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/leave" element={<Leave />} />
          </Route>
        </Route>

        {/* User + Admin */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Employee />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/leave" element={<Leave />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
