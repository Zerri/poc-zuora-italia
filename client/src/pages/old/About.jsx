// File: client/src/pages/About.jsx
import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Zuora POC</h1>
      
      <div className="about-card">
        <h2>Progetto Demo</h2>
        <p>
          Questa è una dimostrazione di un'applicazione fullstack utilizzando React, 
          Express.js e MongoDB (Cosmos DB). È stata sviluppata come Proof of Concept
          per un sistema di gestione di abbonamenti e prodotti.
        </p>
      </div>
      
      <div className="about-card">
        <h2>Tecnologie Utilizzate</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <h3>Frontend</h3>
            <ul>
              <li>React 18</li>
              <li>React Query</li>
              <li>React Router</li>
              <li>CSS personalizzato</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB (Cosmos DB)</li>
              <li>Mongoose</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h3>Deployment</h3>
            <ul>
              <li>Azure App Service</li>
              <li>Azure Cosmos DB</li>
              <li>VS Code Deploy</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="about-card">
        <h2>Funzionalità</h2>
        <p>
          Questa applicazione dimostra:
        </p>
        <ul>
          <li>Gestione di prodotti e abbonamenti</li>
          <li>Interfaccia utente reattiva e moderna</li>
          <li>Integrazione con database cloud</li>
          <li>API RESTful</li>
          <li>Deployment su cloud Azure</li>
        </ul>
      </div>
    </div>
  );
}

export default About;