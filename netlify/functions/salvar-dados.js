// Arquivo: netlify/functions/salvar-dados.js

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  try {
    const dados = JSON.parse(event.body);

    // --- Parte 1: Salvar na Planilha Google ---
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const novaLinha = [
      new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}),
      dados.nome,
      dados.email,
      dados.whatsapp,
      dados.mensagem,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [novaLinha],
      },
    });

    // --- Parte 2: Enviar E-mail de Notificação ---
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // <-- Pega o 'smtp.gmail.com' da Netlify
        port: process.env.EMAIL_PORT, // <-- Pega a porta '465' da Netlify
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, // <-- A Netlify vai colocar 'tcleaner05@gmail.com' aqui
            pass: process.env.EMAIL_PASS, // <-- A Netlify vai colocar a senha de 16 caracteres aqui
        },
    });

    await transporter.sendMail({
        from: `"Site TechCleaner" <${process.env.EMAIL_USER}>`,
        to: "tcleaner05@gmail.com", // << E-mail que vai RECEBER a notificação
        subject: `Novo Contato de ${dados.nome}`,
        html: `
            <h1>Novo Contato Recebido do Site</h1>
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
            <p><strong>WhatsApp:</strong> ${dados.whatsapp}</p>
            <hr>
            <p><strong>Mensagem:</strong></p>
            <p>${dados.mensagem}</p>
        `,
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'Sucesso!' })};

  } catch (error) {
    console.error('Erro na função serverless:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno no servidor.' }),
    };
  }
};
