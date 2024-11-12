// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/registro', async (req, res) => {
    const { nombre, email, telefono, edad, comentarios } = req.body;

    // Correo para el usuario
    const mailOptionsUser = {
        from: process.env.EMAIL,
        to: email,
        subject: '¡Gracias por tu registro!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <h2 style="color: #333;">¡Hola ${nombre}!</h2>
                <p>Gracias por registrarte en nuestro sitio. Hemos recibido tu información:</p>
                <ul>
                    <li>Nombre: ${nombre}</li>
                    <li>Email: ${email}</li>
                    <li>Teléfono: ${telefono}</li>
                </ul>
                <p>Nos pondremos en contacto contigo pronto.</p>
                <p style="color: #666;">Saludos cordiales,<br>El equipo de soporte</p>
            </div>
        `
    };

    // Correo para el administrador
    const mailOptionsAdmin = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Nuevo Registro en el Formulario',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <h2 style="color: #333;">Nuevo Registro Recibido</h2>
                <p>Se ha registrado un nuevo usuario con los siguientes datos:</p>
                <ul>
                    <li>Nombre: ${nombre}</li>
                    <li>Email: ${email}</li>
                    <li>Teléfono: ${telefono}</li>
                    <li>Edad: ${edad}</li>
                    <li>Comentarios: ${comentarios}</li>
                </ul>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptionsUser);
        await transporter.sendMail(mailOptionsAdmin);
        res.json({ success: true });
    } catch (error) {
        console.error('Error al enviar correos:', error);
        res.status(500).json({ success: false, error: 'Error al enviar correos' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});