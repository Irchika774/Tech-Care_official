import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Reviews from './pages/Reviews';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import PCRepair from './pages/PCRepair';
import Profile from './pages/Profile';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Bidding from './pages/Bidding';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Compare from './pages/Compare';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pc-repair" element={<PCRepair />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
