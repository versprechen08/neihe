import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { JournalPage } from './pages/JournalPage';
import { BreathePage } from './pages/BreathePage';
import { JourneyPage } from './pages/JourneyPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <TopNav />
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/breathe" element={<BreathePage />} />
          <Route path="/journey" element={<JourneyPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
