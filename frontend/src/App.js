import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SearchRides from './pages/SearchRides';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Contact from './pages/Contact';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Navbar />
        <main className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/search-rides" element={<SearchRides />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatBox />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
