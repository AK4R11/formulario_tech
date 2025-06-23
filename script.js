// Aguarda o HTML carregar completamente antes de rodar qualquer script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MODAL ---
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensagem = document.getElementById('modal-mensagem');

    // Função para abrir o modal com um título e mensagem personalizados
    function abrirModal(titulo, mensagem) {
        if(modalTitulo && modalMensagem && modalContainer) {
            modalTitulo.innerText = titulo;
            modalMensagem.innerText = mensagem;
            modalContainer.classList.add('visivel');
        }
    }

    // Função para fechar o modal
    function fecharModal() {
        if(modalContainer) {
            modalContainer.classList.remove('visivel');
        }
    }

    // Adiciona os eventos para fechar o modal
    if(modalCloseBtn && modalContainer) {
        modalCloseBtn.addEventListener('click', fecharModal);
        modalContainer.addEventListener('click', (event) => {
            // Fecha o modal apenas se o clique for no fundo escuro, e não na caixa de conteúdo
            if (event.target === modalContainer) {
                fecharModal();
            }
        });
    }

    // --- LÓGICA DO FORMULÁRIO ---
    const form = document.getElementById('meuFormulario');
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
                // Envia os dados para a função serverless na Netlify
                const response = await fetch('/.netlify/functions/salvar-dados', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDoFormulario),
                });
                
                if (response.ok) {
                    abrirModal('Sucesso!', 'Obrigado pelo seu contato! Responderemos em breve.');
                    form.reset();
                } else {
                    abrirModal('Erro!', 'Houve um problema ao enviar o formulário. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro de conexão:', error);
                abrirModal('Erro de Conexão!', 'Não foi possível se conectar ao servidor. Verifique sua internet e tente novamente.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerText = 'Enviar';
            }
        });
    }

    // --- LÓGICA DO CARROSSEL DE BANNERS ---
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
        mostrarBanner(); // Mostra o primeiro banner
        setInterval(proximoBanner, 5000); // Troca de banner a cada 5 segundos
    }
});
