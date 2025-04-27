import React, { useState, useEffect } from 'react';
import './AdminPage.css' // Stile importieren

// Funktion zur Bereinigung der Eingabedaten (entfernt HTML-Tags)
const sanitizeInput = (input) => {
    return input.replace(/<[^>]*>/g, '');  // Entfernt HTML-Tags
};

function Admin() {
    const [firmen, setFirmen] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authorized) {
            fetchFirmen();
        }
    }, [authorized]);

    const fetchFirmen = async () => {
        try {
            const response = await fetch('https://company-application-platform-backend.onrender.com/api/firma', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setFirmen(data);
            } else {
                console.error('Fehler beim Abrufen der Firmen. Status:', response.status);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Firmen:', error);
        }
    };

    const handleLoginSubmit = async () => {
        setLoading(true);

        // Eingaben sanitieren, bevor sie verarbeitet werden
        const sanitizedUsername = sanitizeInput(username);
        const sanitizedPassword = sanitizeInput(password);

        const isValid = await checkLogin(sanitizedUsername, sanitizedPassword);
        if (isValid) {
            setAuthorized(true);
        } else {
            alert('Benutzername oder Passwort sind falsch');
        }

        setLoading(false);
    };

    const checkLogin = async (username, password) => {
        try {
            const response = await fetch('https://company-application-platform-backend.onrender.com/api/admin/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Fehler bei der Login-Überprüfung');
                return false;
            }

            const data = await response.json();
            return data.valid || false;
        } catch (error) {
            console.error('Fehler bei der Login-Überprüfung:', error);
            return false;
        }
    };

    const handleStatusChange = async (firmaId, status) => {
        const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/${firmaId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            const updatedFirma = await response.json();
            setFirmen(firmen.map(firma => 
                firma.id === firmaId ? { ...firma, status: updatedFirma.status } : firma
            ));
            
            // Benachrichtige die andere Seite, dass der Status geändert wurde
            localStorage.setItem('firmaStatusUpdated', Date.now()); // Timestamp speichern
        } else {
            console.error('Fehler beim Aktualisieren des Status');
        }
    };

    const handleDeleteFirma = async (firmaId) => {
        const confirmDelete = window.confirm('Bist du sicher, dass du diese Firma löschen möchtest?');
        if (confirmDelete) {
            const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/${firmaId}`, { method: 'DELETE' });
            if (response.ok) {
                setFirmen(firmen.filter(firma => firma.id !== firmaId));
            } else {
                console.error('Fehler beim Löschen der Firma');
            }
        }
    };

    if (!authorized) {
        return (
            <div className="login-container">
                <h1>Admin Login</h1>
                <input
                    type="text"
                    placeholder="Benutzername eingeben"
                    value={username}
                    onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                    autoComplete="off"
                />
                <input
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                    autoComplete="off"
                />
                <button onClick={handleLoginSubmit} disabled={loading}>
                    {loading ? 'Überprüfe Login...' : 'Einloggen'}
                </button>
            </div>
        );
    }

    return (
        <div className="firmen-container">
            <h1>Admin</h1>
            <ul className="firmen-liste">
                {firmen.map(firma => (
                    <li key={firma.id} className={`firmen-item ${firma.status === 'offen' ? 'status-offen' : firma.status === 'in Arbeit' ? 'status-in-arbeit' : 'status-versendet'}`}>
                        <p><strong>ID:</strong> {firma.id}</p>
                        <p><strong>Firmenname:</strong> {firma.firmenname}</p>
                        <p><strong>Adresse:</strong> {firma.adresse}</p>
                        <p><strong>Kontaktperson:</strong> {firma.kontaktperson}</p>
                        <p><strong>Email:</strong> {firma.email}</p>
                        <p><strong>Telefon:</strong> {firma.telefon}</p>
                        <p><strong>Status:</strong> {firma.status}</p>
                        <div className="firmen-item-footer">
                            <select value={firma.status} onChange={(e) => handleStatusChange(firma.id, e.target.value)}>
                                <option value="offen">Offen</option>
                                <option value="in Arbeit">In Arbeit</option>
                                <option value="versendet">Versendet</option>
                            </select>

                            <button onClick={() => handleDeleteFirma(firma.id)}>
                                Löschen
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
