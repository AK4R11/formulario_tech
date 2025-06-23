// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MODAL ---
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensagem = document.getElementById('modal-mensagem');

    function abrirModal(titulo, mensagem) {
        modalTitulo.innerText = titulo;
        modalMensagem.innerText = mensagem;
        modalContainer.classList.add('visivel');
    }

    function fecharModal() {
        modalContainer.classList.remove('visivel');
    }

    // Fecha o modal se o usuário clicar no botão "X" ou fora da caixa de conteúdo
    modalCloseBtn.addEventListener('click', fecharModal);
    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            fecharModal();
        }
    });

    // --- LÓGICA DO FORMULÁRIO (ATUALIZADA) ---
    const form = document.getElementById('meuFormulario');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
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
                const response = await fetch('/.netlify/functions/salvar-dados', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDoFormulario),
                });
                if (response.ok) {
                    // SUBSTITUI O ALERT POR NOSSO NOVO MODAL
                    abrirModal('Sucesso!', 'Obrigado pelo seu contato! Responderemos em breve.');
                    form.reset();
                } else {
                    // SUBSTITUI O ALERT DE ERRO
                    abrirModal('Erro!', 'Houve um problema ao enviar o formulário. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
                // SUBSTITUI O ALERT DE ERRO DE CONEXÃO
                abrirModal('Erro de Conexão!', 'Não foi possível se conectar ao servidor. Verifique sua internet e tente novamente.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerText = 'Enviar';
            }
        });
    }

    // --- LÓGICA DO CARROSSEL (sem alterações) ---
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
