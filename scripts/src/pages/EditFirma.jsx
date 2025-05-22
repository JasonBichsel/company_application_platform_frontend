import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '');
};

const fetchCsrfToken = async () => {
    try {
        const resp = await fetch('https://company-application-platform-backend.onrender.com/api/csrf-token', {
            credentials: 'include'
        });
        const data = await resp.json();
        return data.token;
    } catch (err) {
        console.warn('Fehler beim CSRF-Token-Fetch:', err);
        return '';
    }
};

function EditFirma() {
    const location = useLocation();
    const navigate = useNavigate();
    const [firma, setFirma] = useState(location.state?.firma || {});
    const [formData, setFormData] = useState({
        firmenname: firma.firmenname || '',
        adresse: firma.adresse || '',
        kontaktperson: firma.kontaktperson || '',
        email: firma.email || '',
        telefon: firma.telefon || ''
    });

    useEffect(() => {
        if (location.state?.firma) {
            setFirma(location.state.firma);
            setFormData({
                firmenname: location.state.firma.firmenname || '',
                adresse: location.state.firma.adresse || '',
                kontaktperson: location.state.firma.kontaktperson || '',
                email: location.state.firma.email || '',
                telefon: location.state.firma.telefon || ''
            });
        }
    }, [location.state?.firma]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);
        setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedFormData = {
            firmenname: sanitizeInput(formData.firmenname),
            adresse: sanitizeInput(formData.adresse),
            kontaktperson: sanitizeInput(formData.kontaktperson),
            email: sanitizeInput(formData.email),
            telefon: sanitizeInput(formData.telefon),
        };

        const updatedFirma = { 
            ...firma, 
            firmenname: sanitizedFormData.firmenname || firma.firmenname,
            adresse: sanitizedFormData.adresse || firma.adresse,
            kontaktperson: sanitizedFormData.kontaktperson || firma.kontaktperson,
            email: sanitizedFormData.email || firma.email,
            telefon: sanitizedFormData.telefon || firma.telefon
        };

        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) {
            alert('CSRF-Token konnte nicht geladen werden.');
            return;
        }

        const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/${firma.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(updatedFirma),
        });

        if (response.ok) {
            navigate('/firmen-list');
        } else {
            alert('Fehler beim Aktualisieren der Firma');
        }
    };

    return (
        <div>
            <h1>Firma bearbeiten</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Firmenname:
                    <input
                        type="text"
                        name="firmenname"
                        value={formData.firmenname}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Adresse:
                    <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Kontaktperson:
                    <input
                        type="text"
                        name="kontaktperson"
                        value={formData.kontaktperson}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    E-Mail:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Telefonnummer:
                    <input
                        type="text"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Firma aktualisieren</button>
            </form>
        </div>
    );
}

export default EditFirma;
