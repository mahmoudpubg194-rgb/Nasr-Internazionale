import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking
  app.post('/api/booking', async (req, res) => {
    const { service, date, time, name, email, phone } = req.body;

    console.log('--- NUOVA PRENOTAZIONE ---');
    console.log('Cliente:', name);
    console.log('Servizio:', service);
    console.log('Data/Ora:', date, 'alle', time);
    console.log('Contatti:', phone, email);
    console.log('--------------------------');

    // Email Sending Logic
    // TO THE USER: To make this send real emails, you need to provide SMTP credentials in .env
    // or use a service like SendGrid/Mailgun.
    // For now, we simulate the logic and log it.
    
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'placeholder@gmail.com',
          pass: process.env.EMAIL_PASS || 'placeholder_pass',
        },
      });

      const mailOptions = {
        from: '"CAF Nasr Booking" <no-reply@cafnasr.it>',
        to: 'nasrmustafa213@gmail.com',
        subject: `Nuova Prenotazione: ${name} - ${service}`,
        text: `
          Nuova prenotazione ricevuta dal sito:
          
          CLIENTE: ${name}
          SERVIZIO: ${service}
          DATA: ${date}
          ORA: ${time}
          WHATSAPP/TEL: ${phone}
          EMAIL: ${email || 'N/A'}
          
          Contatta il cliente per confermare l'appuntamento.
        `,
      };

      // Since we don't have real credentials, we log that it *would* have sent it.
      // If credentials were provided, we could call: await transporter.sendMail(mailOptions);
      console.log('Simulazione invio email a nasrmustafa213@gmail.com completata.');
      
      res.json({ success: true, message: 'Prenotazione ricevuta' });
    } catch (error) {
      console.error('Errore invio email:', error);
      res.status(500).json({ success: false, message: 'Errore durante la prenotazione' });
    }
  });

  // API Route for Cancelling Booking
  app.post('/api/booking/cancel', async (req, res) => {
    const { bookingId, name, service, date, time } = req.body;

    console.log('--- ANNULLAMENTO PRENOTAZIONE ---');
    console.log('ID Prenotazione:', bookingId);
    console.log('Cliente:', name);
    console.log('Servizio:', service);
    console.log('---------------------------------');

    try {
      // Simulate email notification for cancellation
      console.log(`Simulazione invio email di annullamento a nasrmustafa213@gmail.com completata per il servizio ${service}.`);
      
      res.json({ success: true, message: 'Prenotazione annullata con successo' });
    } catch (error) {
      console.error('Errore annullamento:', error);
      res.status(500).json({ success: false, message: 'Errore durante l\'annullamento' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
