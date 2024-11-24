// App.js
import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import { auth } from './config/firebaseClient';
import Navbar from './home/Navbar';
import Home from './home/Home';
import Associations from './pages/Associations';
import About from './pages/About';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Footer from './home/Footer';
import Dashboard from "./admin/Dashboard";
import VolMange from "./volunteer/VolMange";
import AssoMange from "./association/AssoMange";
import AssociationProfile from "./association/AssociationProfile";
import VolunteerProfile from "./volunteer/VolunteerProfile";
import EditVolProfile from "./volunteer/EditVolProfile";
import EditAssoProfile from "./association/EditAssoProfile";
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ? { uid: user.uid, email: user.email } : null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        <Navbar />
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Associations" element={<Associations />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Dashboard/:id" element={<Dashboard />} />
            <Route path="/AssoMange/:id" element={<AssoMange />} />
            <Route path="/VolMange/:id" element={<VolMange />} />
            <Route path="/associationProfile/:id" element={<AssociationProfile />} />
            <Route path="/volunteerProfile/:id" element={<VolunteerProfile />} />
            <Route path="/EditVolProfile/:id" element={<EditVolProfile />} />
            <Route path="/EditAssoProfile/:id" element={<EditAssoProfile />} />
          </Routes>
          <ScrollToTop />
        </div>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;