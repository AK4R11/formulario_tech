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

    // ===================================================================
    //      A CORREÇÃO ESTÁ AQUI: Adicionamos "dados.servico" à linha
    // ===================================================================
    const novaLinha = [
      new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}),
      dados.nome,
      dados.email,
      dados.whatsapp,
      dados.servico, // <-- DADO DO SERVIÇO ADICIONADO AQUI
      dados.mensagem,
    ];

    // Comando para adicionar a nova linha na sua planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [novaLinha],
      },
    });

    // --- Parte 2: Enviar E-mail de Notificação (sem alterações) ---
    // (O código de envio de e-mail continua o mesmo)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // E-mail para você
    await transporter.sendMail({
        from: `"Site TechCleaner" <${process.env.EMAIL_USER}>`,
        to: "tcleaner05@gmail.com",
        subject: `Novo Contato de ${dados.nome} - [${dados.servico}]`, // Adicionei o serviço ao assunto do e-mail!
        html: `
            <h1>Novo Contato Recebido do Site</h1>
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
            <p><strong>WhatsApp:</strong> ${dados.whatsapp}</p>
            <p><strong>Tipo de Serviço:</strong> ${dados.servico}</p>
            <hr>
            <p><strong>Mensagem:</strong></p>
            <p>${dados.mensagem}</p>
        `,
    });

    // E-mail para o cliente
    await transporter.sendMail({
        from: `"TechCleaner" <${process.env.EMAIL_USER}>`,
        to: dados.email,
        subject: `Confirmamos o recebimento do seu contato!`,
        html: `
            <h1>Olá, ${dados.nome}!</h1>
            <p>Recebemos sua mensagem sobre o serviço de <strong>${dados.servico}</strong> e agradecemos pelo seu contato.</p>
            <p>Nossa equipe irá analisar sua solicitação e responderemos o mais breve possível.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe TechCleaner</strong></p>
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
