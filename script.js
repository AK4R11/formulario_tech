// O evento 'DOMContentLoaded' espera que todo o HTML da página seja carregado e analisado
// antes de executar o código que está dentro dele. Isso evita erros de "timing".
document.addEventListener('DOMContentLoaded', () => {

    // ================================================= //
    //            LÓGICA DO FORMULÁRIO                   //
    // ================================================= //
    const form = document.getElementById('meuFormulario');

    // A lógica do formulário agora está segura aqui dentro.
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            const submitButton = form.querySelector('button');
            submitButton.disabled = true;
            submitButton.innerText = 'Enviando...';

            const dadosDoFormulario = {
                nome: event.target.nome.value,
                email: event.target.email.value,
                whatsapp: event.target.whatsapp.value,
                mensagem: event.target.mensagem.value
            };

            try {
                // Envia os dados para a função serverless
                const response = await fetch('/.netlify/functions/salvar-dados', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDoFormulario),
                });

                if (response.ok) {
                    alert('Obrigado pelo seu contato! Formulário enviado com sucesso.');
                    form.reset();
                } else {
                    // Se o servidor responder com um erro, o erro será exibido no console
                    const errorData = await response.json();
                    console.error('Erro do servidor:', errorData);
                    alert('Houve um erro ao enviar o formulário. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
                alert('Houve um erro de conexão. Por favor, tente novamente mais tarde.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerText = 'Enviar';
            }
        });

 // --- NOVA FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES ---
    function mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const container = document.getElementById('notificacao-container');
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerText = mensagem;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4000); // Remove a notificação após 4 segundos
    }
    }

    // ================================================= */
    // ======== LÓGICA DO CARROSSEL DE BANNERS ========= */
    // ================================================= */
    const banners = document.querySelectorAll('.service-banners .banner');
    if (banners.length > 0) {
        let bannerAtual = 0;

        function mostrarBanner() {
            banners.forEach(banner => banner.classList.remove('banner-visivel'));
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
