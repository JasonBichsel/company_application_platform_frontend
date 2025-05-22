import React, { useState, useEffect } from 'react';
import './AdminPage.css'
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
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

        try {
            const sanitizedUsername = sanitizeInput(username.trim());
            const sanitizedPassword = sanitizeInput(password.trim());
            const csrfToken = await fetchCsrfToken();
            if (!csrfToken) {
                alert('CSRF-Token konnte nicht geladen werden.');
                setLoading(false);
                return;
            }
            const isValid = await checkLogin(sanitizedUsername, sanitizedPassword, csrfToken);
            if (isValid) {
                setAuthorized(true);
            } else {
                alert('Benutzername oder Passwort sind falsch');
            }
        } catch (error) {
            console.error('Fehler beim Login:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(false);
        }
    };

    const checkLogin = async (username, password, csrfToken) => {
        try {
            const response = await fetch('https://company-application-platform-backend.onrender.com/api/admin/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
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
        const csrfToken = await fetchCsrfToken();
        if (!csrfToken) {
            alert('CSRF-Token konnte nicht geladen werden.');
            return;
        }

        const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/${firmaId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            const updatedFirma = await response.json();
            setFirmen(firmen.map(firma => 
                firma.id === firmaId ? { ...firma, status: updatedFirma.status } : firma
            ));
            localStorage.setItem('firmaStatusUpdated', Date.now());
        } else {
            console.error('Fehler beim Aktualisieren des Status');
        }
    };

    const handleDeleteFirma = async (firmaId) => {
        const confirmDelete = window.confirm('Bist du sicher, dass du diese Firma löschen möchtest?');
        if (confirmDelete) {
            const csrfToken = await fetchCsrfToken();
            if (!csrfToken) {
                alert('CSRF-Token konnte nicht geladen werden.');
                return;
            }

            const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/${firmaId}`, { 
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': csrfToken },
                credentials: 'include'
            });
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
