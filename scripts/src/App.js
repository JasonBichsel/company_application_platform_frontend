// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Hier BrowserRouter hinzufügen
import AdminPage from './pages/AdminPage';
import RegistrationForm from './pages/RegistrationForm';
import FirmenList from './pages/FirmenList';
import EditFirma from './pages/EditFirma';
import HomePage from './pages/HomePage';

function App() {
    return (
        <BrowserRouter basename="/company_application_platform_frontend"> {/* Routes mit BrowserRouter einwickeln */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/firmen-list" element={<FirmenList />} />
                <Route path="/edit-firma/:id" element={<EditFirma />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
