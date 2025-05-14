// App.jsx
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Hier BrowserRouter hinzufügen
import AdminPage from './pages/AdminPage';
import RegistrationForm from './pages/RegistrationForm';
import FirmenList from './pages/FirmenList';
import EditFirma from './pages/EditFirma';
import HomePage from './pages/HomePage';
import Datenschutzerklärung from './pages/Datenschutzerklärung';


function App() {
    return (
        <HashRouter > {/* Hier HashRouter verwenden */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Datenschutzerklärung" element={<Datenschutzerklärung />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/firmen-list" element={<FirmenList />} />
                <Route path="/edit-firma/:id" element={<EditFirma />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
