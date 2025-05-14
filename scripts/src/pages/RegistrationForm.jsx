import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './RegistrationForm.css';

/* Hilfs-Funktion zur Eingabe-Bereinigung */
const sanitizeInput = (input) => DOMPurify.sanitize(input);

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firmenname: '',
    adresse: '',
    kontaktperson: '',
    email: '',
    telefon: '',
    passwort: '',
    status: 'offen',
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ---------- Handler ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 255) return;          // Eingabelänge limitieren
    setFormData({ ...formData, [name]: sanitizeInput(value) });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ch)$/.test(email);

  const validatePassword = (pw) => pw.length >= 5;

  const validatePhoneNumber = (phone) =>
    /^(\+41|\+49)\d{9,}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedFormData = {
      firmenname: sanitizeInput(formData.firmenname),
      adresse: sanitizeInput(formData.adresse),
      kontaktperson: sanitizeInput(formData.kontaktperson),
      email: sanitizeInput(formData.email),
      telefon: sanitizeInput(formData.telefon),
      passwort: sanitizeInput(formData.passwort),
      status: sanitizeInput(formData.status),
    };

    /* ---------- Validierung ---------- */
    const errors = [];
    if (!sanitizedFormData.firmenname) errors.push('Firmenname ist erforderlich.');
    if (!sanitizedFormData.adresse)     errors.push('Adresse ist erforderlich.');
    if (!sanitizedFormData.email)       errors.push('E-Mail ist erforderlich.');
    if (!sanitizedFormData.telefon)     errors.push('Telefonnummer ist erforderlich.');
    if (!sanitizedFormData.passwort)    errors.push('Passwort ist erforderlich.');

    if (sanitizedFormData.email && !validateEmail(sanitizedFormData.email))
      errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein (mit .ch oder .com).');

    if (sanitizedFormData.passwort && !validatePassword(sanitizedFormData.passwort))
      errors.push('Das Passwort muss mindestens 5 Zeichen lang sein.');

    if (sanitizedFormData.telefon && !validatePhoneNumber(sanitizedFormData.telefon))
      errors.push('Bitte geben Sie eine gültige Telefonnummer für die Schweiz (+41) oder Deutschland (+49) ein.');

    if (errors.length) { setErrorMessages(errors); return; }

    /* ---------- Senden ---------- */
    setLoading(true);
    setErrorMessages([]);

    try {
      const resp = await fetch(
        'https://company-application-platform-backend.onrender.com/api/firma',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedFormData),
        }
      );

      if (resp.ok) {
        alert('Firma erfolgreich registriert!');
        setFormData({
          firmenname: '',
          adresse: '',
          kontaktperson: '',
          email: '',
          telefon: '',
          passwort: formData.passwort, // Passwort bleibt erhalten
          status: 'offen',
        });
        navigate('/firmen-list');
      } else {
        alert('Fehler bei der Registrierung.');
      }
    } catch (err) {
      console.error('Fehler:', err);
      alert('Es gab einen Fehler bei der Registrierung.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div>
      <h1>Firma Registrieren</h1>

      {!loading && errorMessages.length > 0 && (
        <div style={{ color: 'red', marginBottom: '10px', position: 'relative' }}>
          {errorMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffcccb',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '5px',
                position: 'relative',
              }}
            >
              <span>{msg}</span>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-10px',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #ffcccb',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {loading && <p>Registrierung läuft… Bitte warten…</p>}

      <form onSubmit={handleSubmit}>
        
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

        <p style={{ fontSize: '0.9em' }}>
          Hinweis: Das Passwort kann nicht zurückgesetzt werden.
        </p>

        <p style={{ fontSize: '0.9em' }}>
          Hinweis: Die eingegebenen Daten (ausser Passwort) werden öffentlich in der Firmenliste angezeigt.
        </p>

        {/* ------- verbesserte Checkbox & Text ------- */}
        <label htmlFor="zustimmung" className="checkbox-label">
            <span className="checkbox-text">Ich stimme der öffentlichen Anzeige meiner eingegebenen Firmendaten zu.</span>
            <input type="checkbox" id="zustimmung" required />
        </label>

        <p style={{ fontSize: '0.9em' }}>
          Mit dem Absenden dieses Formulars stimme ich der Verarbeitung meiner Daten gemäss der&nbsp;
          <Link to="/Datenschutzerklärung">Datenschutzerklärung</Link> zu.
        </p>

        <button type="submit" disabled={loading}>
          Registrieren
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
