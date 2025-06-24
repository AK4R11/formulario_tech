// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // LÓGICA DA PÁGINA PRINCIPAL (INDEX.HTML)
    // =====================================================================

    // Procura por um elemento que só existe na 'index.html', como o formulário.
    const form = document.getElementById('meuFormulario');
    if (form) {
        // Se o formulário for encontrado, executa todo o código da página principal.
        
        // --- Modal de Notificação do Formulário ---
        const notificacaoModal = document.getElementById('modal-container');
        const notificacaoCloseBtn = document.getElementById('modal-close-btn');
        const notificacaoTitulo = document.getElementById('modal-titulo');
        const notificacaoMensagem = document.getElementById('modal-mensagem');

        function abrirNotificacaoModal(titulo, mensagem) {
            if (notificacaoModal) {
                notificacaoTitulo.innerText = titulo;
                notificacaoMensagem.innerText = mensagem;
                notificacaoModal.classList.add('visivel');
            }
        }
        function fecharNotificacaoModal() {
            if (notificacaoModal) notificacaoModal.classList.remove('visivel');
        }
        if(notificacaoCloseBtn) notificacaoCloseBtn.addEventListener('click', fecharNotificacaoModal);
        if(notificacaoModal) notificacaoModal.addEventListener('click', (e) => {
            if (e.target === notificacaoModal) fecharNotificacaoModal();
        });

        // --- Lógica de Envio do Formulário ---
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector('button');
            submitButton.disabled = true;
            submitButton.innerText = 'Enviando...';
            // ... (resto do seu código de envio fetch que já funciona) ...
            // Exemplo de como chamar o modal no final da lógica fetch:
            abrirNotificacaoModal('Sucesso!', 'Dados enviados!');
        });
        
        // --- Lógica do Carrossel de Banners ---
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
    }


    // =====================================================================
    // LÓGICA DA PÁGINA DE DESENVOLVEDOR (DEV.HTML)
    // =====================================================================

    // Procura por um elemento que só existe na 'dev.html', como a grade de produtos.
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        // Se a grade for encontrada, executa todo o código da página de dev.

        // --- "Banco de Dados" com os scripts. VERIFIQUE OS CAMINHOS AQUI ---
        const scriptsPorServico = {
            otimizacao: [
                { nome: 'Otimizar Sistema', arquivo: 'scripts/otimizar_sistema.zip' },
                { nome: 'Otimizador de Build v1.2', arquivo: 'scripts/build-optimizer.zip' }
            ],
            seguranca: [
                { nome: 'Documentação da API de Segurança', arquivo: 'scripts/api-docs.pdf' }
            ],
            templates: [
                { nome: 'Template PostgreSQL', arquivo: 'scripts/template-postgres.sql' }
            ]
        };

        // --- Lógica do Modal de Scripts ---
        const scriptsModal = document.getElementById('scripts-modal-container');
        const scriptsModalCloseBtn = document.getElementById('scripts-modal-close-btn');
        const scriptsModalTitulo = document.getElementById('scripts-modal-titulo');
        const scriptsModalLista = document.getElementById('scripts-modal-lista');

        function abrirScriptsModal(servicoId, servicoTitulo) {
            const scripts = scriptsPorServico[servicoId] || [];
            if (!scriptsModal) return;

            scriptsModalTitulo.innerText = `Downloads para ${servicoTitulo}`;
            scriptsModalLista.innerHTML = ''; // Limpa a lista antes de preencher

            if (scripts.length > 0) {
                scripts.forEach(script => {
                    const item = document.createElement('li');
                    // Cria o link de download com o atributo 'download'
                    item.innerHTML = `<span>${script.nome}</span> <a href="${script.arquivo}" download>Baixar</a>`;
                    scriptsModalLista.appendChild(item);
                });
            } else {
                scriptsModalLista.innerHTML = '<li>Nenhum download disponível para este serviço.</li>';
            }
            scriptsModal.classList.add('visivel');
        }

        function fecharScriptsModal() {
            if (scriptsModal) scriptsModal.classList.remove('visivel');
        }

        if(scriptsModalCloseBtn) scriptsModalCloseBtn.addEventListener('click', fecharScriptsModal);
        if(scriptsModal) scriptsModal.addEventListener('click', (e) => {
            if (e.target === scriptsModal) fecharScriptsModal();
        });

        // --- Lógica de Clique nos Cards de Produto ---
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const button = card.querySelector('.product-button');
            if(button) {
                button.addEventListener('click', () => {
                    const servicoId = card.dataset.service;
                    const servicoTitulo = card.querySelector('h2').innerText;
                    abrirScriptsModal(servicoId, servicoTitulo);
                });
            }
        });
    }
});