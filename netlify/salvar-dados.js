// netlify/functions/salvar-dados.js

// Importa a biblioteca oficial do Google para interagir com suas APIs
const { google } = require('googleapis');

// A função principal que será executada pela Netlify
exports.handler = async function (event) {
  try {
    // Pega os dados enviados pelo formulário (que estão no 'corpo' da requisição)
    const dados = JSON.parse(event.body);

    // Configura as credenciais de acesso usando as Variáveis de Ambiente que você configurou na Netlify
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    
    // O ID da sua planilha, também vindo das Variáveis de Ambiente
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Autoriza o acesso à API do Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Prepara a nova linha a ser inserida na planilha
    const novaLinha = [
      new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}), // Data e hora do envio
      dados.nome,
      dados.email,
      dados.whatsapp,
      dados.mensagem,
    ];

    // Comando para adicionar a nova linha na sua planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1', // Começa a verificar a partir da célula A1 para encontrar a próxima linha vazia
      valueInputOption: 'USER_ENTERED', // Insere os dados como se um usuário estivesse digitando
      requestBody: {
        values: [novaLinha],
      },
    });

    // Se tudo deu certo, retorna uma resposta de sucesso para o front-end
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dados salvos com sucesso!' }),
    };

  } catch (error) {
    // Se algo der errado, registra o erro e retorna uma mensagem de falha
    console.error('Erro ao salvar na planilha:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno ao salvar os dados.' }),
    };
  }
};