// ================================================= //
//        LÓGICA DO FORMULÁRIO (ATUALIZADA)          //
// ================================================= //

const form = document.getElementById('meuFormulario');

// A função agora é 'async' para podermos usar 'await' e esperar a resposta do servidor
form.addEventListener('submit', async (event) => {
    // Impede o recarregamento da página
    event.preventDefault();

    const submitButton = form.querySelector('button');
    // Desativa o botão e mostra um feedback para o usuário
    submitButton.disabled = true;
    submitButton.innerText = 'Enviando...';

    // Coleta os dados do formulário
    const dadosDoFormulario = {
        nome: event.target.nome.value,
        email: event.target.email.value,
        whatsapp: event.target.whatsapp.value,
        mensagem: event.target.mensagem.value
    };

    try {
        // Usa a API 'fetch' para enviar os dados para a nossa função no back-end
        // O Netlify automaticamente disponibiliza a função neste endereço
        const response = await fetch('/.netlify/functions/salvar-dados', {
            method: 'POST', // Método de envio
            headers: { 'Content-Type': 'application/json' }, // Avisa que estamos enviando dados em JSON
            body: JSON.stringify(dadosDoFormulario), // Converte nosso objeto de dados em texto JSON
        });

        if (response.ok) {
            // Se a resposta do servidor for positiva (sucesso)
            alert('Obrigado pelo seu contato! Formulário enviado com sucesso.');
            form.reset(); // Limpa o formulário
        } else {
            // Se o servidor responder com um erro
            alert('Houve um erro ao enviar o formulário. Tente novamente.');
        }

    } catch (error) {
        // Se houver um erro de rede ou conexão
        console.error('Erro de conexão:', error);
        alert('Houve um erro de conexão. Por favor, tente novamente mais tarde.');
    } finally {
        // Este bloco 'finally' sempre será executado, independentemente de sucesso ou erro
        // Reativa o botão e restaura o texto original
        submitButton.disabled = false;
        submitButton.innerText = 'Enviar';
    }
});


/* ================================================= */
/* ======== LÓGICA DO CARROSSEL DE BANNERS ========= */
/* ================================================= */
// (Esta parte do código continua a mesma)

document.addEventListener('DOMContentLoaded', () => {
    const banners = document.querySelectorAll('.service-banners .banner');
    if (banners.length > 0) {
        let bannerAtual = 0;

        function mostrarBanner() {
            banners.forEach(banner => {
                banner.classList.remove('banner-visivel');
            });
            banners[bannerAtual].classList.add('banner-visivel');
        }

        function proximoBanner() {
            bannerAtual = (bannerAtual + 1) % banners.length;
            mostrarBanner();
        }

        mostrarBanner();
        setInterval(proximoBanner, 5000);
    }
});