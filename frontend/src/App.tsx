import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { JournalPage } from './pages/JournalPage';
import { BreathePage } from './pages/BreathePage';
import { JourneyPage } from './pages/JourneyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/breathe" element={<BreathePage />} />
        <Route path="/journey" element={<JourneyPage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
