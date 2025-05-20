import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Funktion zur Bereinigung der Eingabedaten
const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '');  // Entfernt HTML-Tags
};

// Hilfsfunktion: CSRF-Token holen
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
    const location = useLocation(); // Holen der Firma aus dem state
    const navigate = useNavigate();
    
    // Initialisieren der Firma und Formulardaten
    const [firma, setFirma] = useState(location.state?.firma || {});
    const [formData, setFormData] = useState({
        firmenname: firma.firmenname || '',
        adresse: firma.adresse || '',
        kontaktperson: firma.kontaktperson || '',
        email: firma.email || '',
        telefon: firma.telefon || ''
        // Passwort wird hier nicht gesetzt, da es nicht bearbeitet werden soll
    });

    useEffect(() => {
        // Nur ausführen, wenn location.state.firma sich geändert hat
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
    }, [location.state?.firma]);  // Abhängigkeit nur von `location.state?.firma`

    // Funktion zum Bearbeiten der Formulardaten und sicherstellen, dass die Eingabe sicher ist
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Bereinige die Eingabe, bevor sie gesetzt wird
        const sanitizedValue = sanitizeInput(value);

        setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };

    // Funktion zum Absenden des Formulars
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

        // CSRF-Token holen
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) {
            alert('CSRF-Token konnte nicht geladen werden.');
            return;
        }

        // API-Anfrage zum Aktualisieren der Firma
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
            // Nach erfolgreicher Aktualisierung zurück zur Firmenübersicht
            navigate('/firmen-list');
        } else {
            // Fehlerbehandlung
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
                {/* Das Passwortfeld wird hier nicht angezeigt */}
                <button type="submit">Firma aktualisieren</button>
            </form>
        </div>
    );
}

export default EditFirma;
