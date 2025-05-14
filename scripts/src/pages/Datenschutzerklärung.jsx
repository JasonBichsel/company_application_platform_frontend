import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function Datenschutzerklärung() {
    const navigate = useNavigate();

    return (
        <div className="firmenstart-container">
            <main>
                <h1>Datenschutzerklärung</h1>
                <p>Diese Datenschutzerklärung informiert Sie darüber, wie personenbezogene Daten auf dieser Website verarbeitet werden.</p>

                <h2>1. Verantwortlicher</h2>
                <p>Jason Bichsel<br />Schweiz<br />E-Mail: <a href="mailto:Bichsel6343@outlook.com">Bichsel6343@outlook.com</a></p>

                <h2>2. Erhobene Daten</h2>
                <p>Wenn Sie sich über das Firmen-Registrierungsformular anmelden, erfassen wir folgende Angaben:</p>
                <ul>
                    <li>Firmenname</li>
                    <li>Adresse</li>
                    <li>Kontaktperson</li>
                    <li>E-Mail-Adresse</li>
                    <li>Telefonnummer</li>
                    <li>Passwort (nicht wiederherstellbar)</li>
                </ul>

                <h2>3. Zweck und Rechtsgrundlage der Datenverarbeitung</h2>
                <p>Die Daten werden verwendet, um Ihre Firma als potenziellen Empfänger einer Bewerbung von Jason Bichsel aufzulisten. Die übermittelten Daten (ausser Passwort) werden in einer öffentlich zugänglichen Firmenliste auf der Website dargestellt. Diese Liste wird regelmässig aktualisiert, damit interessierte Firmen stets die aktuellen Informationen zu den Bewerbungen einsehen können.</p>
                <p>Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung gemäss Art. 6 Abs. 6 revDSG.</p>

                <h2>4. Datenweitergabe und Datenübermittlung</h2>
                <p>Die übermittelten Daten (ausser Passwort) sind öffentlich einsehbar. Es erfolgt keine Weitergabe der Daten an Dritte ausserhalb der öffentlich sichtbaren Plattform. Die Veröffentlichung erfolgt nur nach ausdrücklicher Zustimmung beim Absenden des Formulars.</p>
                <p>Es findet keine Übermittlung Ihrer personenbezogenen Daten ins Ausland statt.</p>

                <h2>5. Speicherung und Sicherheit</h2>
                <p>Die Daten werden sicher gespeichert und auf Anfrage gelöscht. Passwörter werden nicht im Klartext gespeichert und können nicht zurückgesetzt werden.</p>
                <p>Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um Ihre Daten gegen Manipulation, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen.</p>

                <h2>6. Ihre Rechte</h2>
                <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung Ihrer gespeicherten Daten. Bitte kontaktieren Sie dazu den Verantwortlichen unter der oben genannten E-Mail-Adresse.</p>

                <h2>7. Cookies und Tracking</h2>
                <p>Diese Website verwendet keine Cookies und kein Tracking.</p>

                <h2>8. Änderungen</h2>
                <p>Diese Datenschutzerklärung kann jederzeit angepasst werden. Die jeweils aktuelle Version wird auf dieser Seite veröffentlicht.</p>

                <p><strong>Stand: Mai 2025</strong></p>

                <div className="button-container">
                    <button onClick={() => navigate('/register')} className="btn">Firmen Bewerbung</button>
                </div>
            </main>
        </div>
    );
}

export default Datenschutzerklärung;
