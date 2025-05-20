import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './RegistrationForm.css';

const sanitizeInput = (input) => DOMPurify.sanitize(input);

function RegistrationForm() {
  // ...existing code...
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

  // ...existing code...

  // Hilfsfunktion: Vergleiche Token im Header und Cookie
  const fetchCsrfTokenAndCookie = async () => {
  try {
    const resp = await fetch('https://company-application-platform-backend.onrender.com/api/csrf-token', {
      credentials: 'include'
    });
    const data = await resp.json();
    console.log('CSRF-Token aus Response:', data.token);
    // Hinweis: Bei Cross-Origin ist der Cookie im Browser oft NICHT lesbar (zeigt <empty string>), das ist normal!
    // Spring prüft aber intern, ob das Token im Header mit dem Cookie (serverseitig) übereinstimmt.
    return data.token;
  } catch (err) {
    console.warn('Fehler beim CSRF-Token-Fetch:', err);
    return '';
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > 255) return;
    setFormData({ ...formData, [name]: sanitizeInput(value) });
  };

  const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ch)$/.test(email);
  const validatePassword = (pw) => pw.length >= 5;
  const validatePhoneNumber = (phone) => /^(\+41|\+49)\d{9,}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages([]);

    // Token direkt vor dem POST holen!
    const csrfToken = await fetchCsrfTokenAndCookie();
    if (!csrfToken || csrfToken.length < 10 || csrfToken.length > 2000) {
      setErrorMessages(['CSRF-Token konnte nicht geladen werden.']);
      setLoading(false);
      return;
    }

    const sanitizedFormData = {
      firmenname: sanitizeInput(formData.firmenname),
      adresse: sanitizeInput(formData.adresse),
      kontaktperson: sanitizeInput(formData.kontaktperson),
      email: sanitizeInput(formData.email),
      telefon: sanitizeInput(formData.telefon),
      passwort: sanitizeInput(formData.passwort),
      status: sanitizeInput(formData.status),
    };

    const errors = [];
    if (!sanitizedFormData.firmenname) errors.push('Firmenname ist erforderlich.');
    if (!sanitizedFormData.adresse) errors.push('Adresse ist erforderlich.');
    if (!sanitizedFormData.email) errors.push('E-Mail ist erforderlich.');
    if (!sanitizedFormData.telefon) errors.push('Telefonnummer ist erforderlich.');
    if (!sanitizedFormData.passwort) errors.push('Passwort ist erforderlich.');
    if (sanitizedFormData.email && !validateEmail(sanitizedFormData.email))
      errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein (mit .ch oder .com).');
    if (sanitizedFormData.passwort && !validatePassword(sanitizedFormData.passwort))
      errors.push('Das Passwort muss mindestens 5 Zeichen lang sein.');
    if (sanitizedFormData.telefon && !validatePhoneNumber(sanitizedFormData.telefon))
      errors.push('Bitte geben Sie eine gültige Telefonnummer für die Schweiz (+41) oder Deutschland (+49) ein.');
    if (errors.length) {
      setErrorMessages(errors);
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(
        'https://company-application-platform-backend.onrender.com/api/firma/register',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
          },
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
          passwort: '',
          status: 'offen',
        });
        navigate('/firmen-list');
      } else {
        const data = await resp.json();
        alert(data.error || 'Fehler bei der Registrierung.');
      }
    } catch (err) {
      console.error('Fehler:', err);
      alert('Es gab einen Fehler bei der Registrierung.');
    } finally {
      setLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="firmenname"
          placeholder="Firmenname*"
          value={formData.firmenname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="adresse"
          placeholder="Adresse*"
          value={formData.adresse}
          onChange={handleChange}
          required
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
          required
        />
        <input
          type="text"
          name="telefon"
          placeholder="Telefonnummer*"
          value={formData.telefon}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="passwort"
          placeholder="Passwort*"
          value={formData.passwort}
          onChange={handleChange}
          required
        />
        <p style={{ fontSize: '0.9em' }}>
          Hinweis: Das Passwort kann nicht zurückgesetzt werden.
        </p>
        <p style={{ fontSize: '0.9em' }}>
          Hinweis: Die eingegebenen Daten (ausser Passwort) werden öffentlich in der Firmenliste angezeigt.
        </p>
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