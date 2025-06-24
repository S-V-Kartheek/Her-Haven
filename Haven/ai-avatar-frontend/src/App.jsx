import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TherapyBot from './pages/TherapyBot';
import LawBot from './pages/LawBot';
import HealthReportPage from './pages/HealthReportPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Chat from './pages/Chat';
import StegoBot from './pages/StegoBot';
import ChatIframe from './pages/ChatIframe';
import LawBotIframe from './pages/LawBotIframe';
import StegoBotIframe from './pages/StegoBotIframe';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/therapy-bot"
            element={
              <ProtectedRoute>
                <TherapyBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/law-bot"
            element={
              <ProtectedRoute>
                <LawBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-tracker"
            element={
              <ProtectedRoute>
                <HealthReportPage />
              </ProtectedRoute>
            }
          />
          <Route path="/chat" element={<ChatIframe />} />
          <Route path="/stego-bot" element={<StegoBotIframe />} />
          <Route path="/health-report" element={<HealthReportPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
