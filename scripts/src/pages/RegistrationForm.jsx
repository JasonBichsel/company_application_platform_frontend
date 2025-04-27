import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importiere den useNavigate-Hook

// Funktion zur Bereinigung der Eingabedaten
const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '');  // Entfernt HTML-Tags
};

function RegistrationForm() {
    const [formData, setFormData] = useState({
        firmenname: '',
        adresse: '',
        kontaktperson: '',
        email: '',
        telefon: '',
        passwort: '',
        status: 'offen'
    });

    const [errorMessages, setErrorMessages] = useState([]);
    const [loading, setLoading] = useState(false); // Zustand für das Laden
    const navigate = useNavigate(); // Verwende den Hook zum Navigieren

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Bereinige die Eingabe, bevor sie gesetzt wird
        const sanitizedValue = sanitizeInput(value);

        setFormData({
            ...formData,
            [name]: sanitizedValue
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ch)$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Passwort-Validierung: Muss mindestens 5 Zeichen lang sein
        return password.length >= 5;
    };

    const validatePhoneNumber = (phone) => {
        // Telefonnummer-Validierung: Erlaubt Leerzeichen und überprüft, ob es mit +41 oder +49 beginnt
        const phoneRegex = /^(\+41|\+49)\d{9,}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];

        // Überprüfe, ob alle Felder ausgefüllt sind
        if (!formData.firmenname) {
            errors.push("Firmenname ist erforderlich.");
        }
        if (!formData.adresse) {
            errors.push("Adresse ist erforderlich.");
        }
        if (!formData.email) {
            errors.push("E-Mail ist erforderlich.");
        }
        if (!formData.telefon) {
            errors.push("Telefonnummer ist erforderlich.");
        }
        if (!formData.passwort) {
            errors.push("Passwort ist erforderlich.");
        }

        // E-Mail validieren
        if (formData.email && !validateEmail(formData.email)) {
            errors.push("Bitte geben Sie eine gültige E-Mail-Adresse ein (mit .ch oder .com).");
        }

        // Passwort validieren (mindestens 5 Zeichen)
        if (formData.passwort && !validatePassword(formData.passwort)) {
            errors.push("Das Passwort muss mindestens 5 Zeichen lang sein.");
        }

        // Telefonnummer validieren
        if (formData.telefon && !validatePhoneNumber(formData.telefon)) {
            errors.push("Bitte geben Sie eine gültige Telefonnummer für die Schweiz (+41) oder Deutschland (+49) ein.");
        }

        // Wenn Fehler vorhanden, setze Fehlermeldungen und stoppe die Registrierung
        if (errors.length > 0) {
            setErrorMessages(errors);
            return;
        }

        // Ladezustand aktivieren und Fehlermeldungen löschen
        setLoading(true);
        setErrorMessages([]); // Löscht die Fehlermeldungen während des Ladevorgangs

        try {
            const response = await fetch('https://company-application-platform-backend.onrender.com/api/firma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Firma erfolgreich registriert!");
                
                // Hier wird nur das Formular zurückgesetzt, aber das Passwort bleibt erhalten
                setFormData({
                    firmenname: '',
                    adresse: '',
                    kontaktperson: '',
                    email: '',
                    telefon: '',
                    passwort: formData.passwort, // Passwort bleibt erhalten
                    status: 'offen'
                });

                navigate('/firmen-list'); // Weiterleitung zur Firmenliste-Seite
            } else {
                alert("Fehler bei der Registrierung.");
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert("Es gab einen Fehler bei der Registrierung.");
        } finally {
            // Ladezustand deaktivieren, egal ob erfolgreich oder fehlerhaft
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Firma Registrieren</h1>

            {/* Fehleranzeige als Tooltip (Sprechblase) */}
            {!loading && errorMessages.length > 0 && (
                <div style={{ color: 'red', marginBottom: '10px', position: 'relative' }}>
                    {errorMessages.map((msg, index) => (
                        <div key={index} style={{ 
                            backgroundColor: '#ffcccb', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            marginBottom: '5px', 
                            position: 'relative' 
                        }}>
                            <span>{msg}</span>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: '-10px',
                                width: '0',
                                height: '0',
                                borderLeft: '10px solid transparent',
                                borderRight: '10px solid transparent',
                                borderTop: '10px solid #ffcccb',
                                transform: 'translateY(-50%)'
                            }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Ladeanzeige */}
            {loading && (
                <div>
                    <p>Registrierung läuft... Bitte warten...</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Hinweis, dass das Passwort nicht zurückgesetzt wird */}
                <p style={{ color: 'gray', fontSize: '12px' }}>
                    Hinweis: Das Passwort kann nicht zurückgesetzt werden.
                </p>
                
                <input
                    type="text"
                    name="firmenname"
                    placeholder="Firmenname*"
                    value={formData.firmenname}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="adresse"
                    placeholder="Adresse*"
                    value={formData.adresse}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="kontaktperson"
                    placeholder="Kontaktperson"
                    value={formData.kontaktperson}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="E-Mail*"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="telefon"
                    placeholder="Telefonnummer*"
                    value={formData.telefon}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="passwort"
                    placeholder="Passwort*"
                    value={formData.passwort}
                    onChange={handleChange}
                />
                <button type="submit" disabled={loading}>Registrieren</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
