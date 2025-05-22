import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './FirmenList.css'; // CSS-Datei eingebunden

// CSRF-Token vom Backend holen
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

function FirmenList() {
    const [firmen, setFirmen] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [password, setPassword] = useState('');
    const [selectedFirma, setSelectedFirma] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingFirmen, setLoadingFirmen] = useState(true);
    const [csrfToken, setCsrfToken] = useState(''); // CSRF-Token State
    const navigate = useNavigate();

    // Firmenliste und CSRF-Token holen
    const fetchFirmen = async () => {
        try {
            setLoadingFirmen(true);
            // CSRF-Token holen und speichern
            const token = await fetchCsrfToken();
            setCsrfToken(token);
            const response = await fetch('https://company-application-platform-backend.onrender.com/api/firma', {
                method: 'GET',
                headers: {
                    'X-XSRF-TOKEN': token
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setFirmen(data);
            } else {
                console.error('Fehler beim Abrufen der Firmen');
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Firmen:', error);
        } finally {
            setLoadingFirmen(false);
        }
    };

    useEffect(() => {
        fetchFirmen();
        const handleStorageChange = (e) => {
            if (e.key === 'firmaStatusUpdated') {
                fetchFirmen();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleEditClick = (firma) => {
        setSelectedFirma(firma);
        setIsModalOpen(true);
    };

    const handleUpdateFirma = async () => {
        if (!password) {
            alert('Bitte Passwort eingeben.');
            return;
        }
        const sanitizedPassword = DOMPurify.sanitize(password.trim());
        const isPasswordValid = await checkPassword(selectedFirma.id, sanitizedPassword);
        if (isPasswordValid) {
            navigate(`/edit-firma/${selectedFirma.id}`, { state: { firma: selectedFirma } });
        } else {
            alert('Falsches Passwort.');
        }
        setLoading(false);
        setIsModalOpen(false);
    };

    // CSRF-Token beim Passwort-Check mitsenden
    const checkPassword = async (id, password) => {
        try {
            const response = await fetch(`https://company-application-platform-backend.onrender.com/api/firma/check-passwort/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken // Token aus State verwenden
                },
                body: JSON.stringify({ password }),
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Fehler bei der Passwortüberprüfung:', response.status);
                return false;
            }
            const data = await response.json();
            return data.valid || false;
        } catch (error) {
            console.error('Fehler bei der Passwortüberprüfung:', error);
            return false;
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="firmen-container">
            <h1>Firmenübersicht</h1>
            {loadingFirmen ? ( // Show spinner while loading
                <>
                <div><p style={{ fontSize: '0.9em' }}>Hinweis: Die Firmenliste braucht etwas Zeit um zu laden</p></div>
                <div className="spinner">Lädt...</div>
                </>
            ) : (
                <>
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Suche nach Firmen..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="search-bar"
                        />
                        <button onClick={handleGoHome} className="back-button">
                            Zurück zur Startseite
                        </button>
                    </div>
                    <ul className="firmen-liste">
                        {firmen.filter(firma => firma.firmenname.toLowerCase().includes(searchTerm.toLowerCase())).map((firma) => (
                            <li key={firma.id} className={`firmen-item ${firma.status === 'offen' ? 'status-offen' : firma.status === 'in Arbeit' ? 'status-in-arbeit' : 'status-versendet'}`}>
                                <p className="firmenname"><strong>Firmenname:</strong> {firma.firmenname}</p>
                                <p className="details"><strong>Adresse:</strong> {firma.adresse}</p>
                                <p className="details"><strong>Kontaktperson:</strong> {firma.kontaktperson}</p>
                                <p className="details"><strong>Email:</strong> {firma.email}</p>
                                <p className="details"><strong>Telefon:</strong> {firma.telefon}</p>
                                <p className="details"><strong>Status:</strong> {firma.status}</p>
                                <button onClick={() => handleEditClick(firma)}>Bearbeiten</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUpdateFirma}
                loading={loading}
                password={password}
                onPasswordChange={(e) => setPassword(e.target.value)}
            />
        </div>
    );
}

export default FirmenList;
