import React, { useState } from 'react';
import DOMPurify from 'dompurify';

function Modal({ isOpen, onClose, onSubmit, loading, password, onPasswordChange }) {
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const sanitizedPassword = DOMPurify.sanitize(password.trim());
        if (!sanitizedPassword || sanitizedPassword.length < 5) {
            setErrorMessage('Das Passwort muss mindestens 5 Zeichen lang sein.');
            return;
        }
        setErrorMessage('');
        onSubmit();
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>Passwort eingeben, um fortzufahren</h2>
                <input
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => {
                        setErrorMessage('');
                        onPasswordChange(e);
                    }}
                    autoComplete="off"
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Überprüfe Passwort...' : 'Firma bearbeiten'}
                    </button>
                    <button onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export default Modal;
