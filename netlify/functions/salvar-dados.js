// Arquivo: netlify/functions/salvar-dados.js

// Importa as bibliotecas necessárias
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// A função principal que a Netlify executa
exports.handler = async function (event) {
  try {
    const dados = JSON.parse(event.body);

    // --- Parte 1: Salvar na Planilha Google (continua igual) ---
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

    // --- Parte 2: Enviar E-mail de Notificação para VOCÊ (continua igual) ---
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Site TechCleaner" <${process.env.EMAIL_USER}>`,
        to: "tcleaner05@gmail.com", // Seu e-mail para receber a notificação
        subject: `Novo Contato de ${dados.nome}`,
        html: `<h1>Novo Contato Recebido do Site</h1><p><strong>Nome:</strong> ${dados.nome}</p><p><strong>Email:</strong> ${dados.email}</p><p><strong>WhatsApp:</strong> ${dados.whatsapp}</p><hr><p><strong>Mensagem:</strong></p><p>${dados.mensagem}</p>`,
    });

    // ===================================================================
    //      NOVA PARTE: Enviar E-mail de Confirmação para o CLIENTE
    // ===================================================================
    await transporter.sendMail({
        from: `"TechCleaner" <${process.env.EMAIL_USER}>`,
        // O destinatário agora é o e-mail que o cliente preencheu no formulário
        to: dados.email, 
        subject: `Confirmamos o recebimento do seu contato!`,
        html: `
            <h1>Olá, ${dados.nome}!</h1>
            <p>Recebemos sua mensagem e agradecemos pelo seu contato.</p>
            <p>Nossa equipe irá analisar sua solicitação e responderemos o mais breve possível.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe TechCleaner</strong></p>
        `,
    });


    // Retorna uma resposta de sucesso se tudo deu certo
    return { statusCode: 200, body: JSON.stringify({ message: 'Sucesso!' })};

  } catch (error) {
    // Se qualquer uma das etapas falhar, registra o erro
    console.error('Erro na função serverless:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno no servidor.' }),
    };
  }
};
