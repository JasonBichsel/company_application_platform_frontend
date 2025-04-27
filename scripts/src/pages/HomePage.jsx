import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function FirmenStart() {
    const navigate = useNavigate();

    return (
        <div className="firmenstart-container">
            <header>
                <h1>Willkommen zur Firmenbewerbungsplattform</h1>
                <p>Diese Webseite ermöglicht es Firmen, mich durch die Registrierung zu kontaktieren. Jede Firma erhält garantiert eine E-Mail von mir. Zudem können sie jederzeit den aktuellen Status meiner Bewerbung auf der Webseite einsehen. Falls Fragen bestehen, können sie mich einfach per Telefon oder E-Mail kontaktieren.</p>
            </header>

            <main>
                <div className="button-container">
                    <button onClick={() => navigate('/register')} className="btn">Firmen Bewerbung</button>
                    <button onClick={() => navigate('/firmen-list')} className="btn">Die beworbenen Firmen</button>
                </div>
            </main>

            <footer>
                <p>&copy; 2025 Jason Bichsel - Firmen Bewerbungsplattform</p>
            </footer>
        </div>
    );
}

export default FirmenStart;
