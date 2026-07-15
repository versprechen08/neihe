import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { JournalPage } from './pages/JournalPage';
import { BreathePage } from './pages/BreathePage';
import { JourneyPage } from './pages/JourneyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AUTH_ROUTES = ['/login', '/register'];

function AppShell() {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-paper">
      {!isAuthRoute && <TopNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/breathe" element={<BreathePage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {!isAuthRoute && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
