

// netlify/functions/salvar-dados.js
const { google } = require('googleapis');

exports.handler = async function (event) {
  try {
    const dados = JSON.parse(event.body);
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
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dados salvos com sucesso!' }),
    };
  } catch (error) {
    console.error('Erro ao salvar na planilha:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno ao salvar os dados.' }),
    };
  }
};
