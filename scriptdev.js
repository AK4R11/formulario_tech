// Arquivo: dev-script.js (Apenas para a página dev.html)

document.addEventListener('DOMContentLoaded', () => {

    // "Banco de dados" com os scripts para cada serviço
    const scriptsPorServico = {
        otimizacao: [
            { nome: 'Script de Automatização', arquivo: 'script_otimizacao_sistema.zip' },
            { nome: 'Otimizador de Build v1.2', arquivo: 'scripts/build-optimizer.zip' }
        ],
        seguranca: [
            { nome: 'Documentação da API de Segurança', arquivo: 'scripts/api-docs.pdf' }
        ],
        templates: [
            { nome: 'Template PostgreSQL', arquivo: 'scripts/template-postgres.sql' }
        ]
    };

    // Seleciona os elementos do modal de scripts
    const scriptsModal = document.getElementById('scripts-modal-container');
    const scriptsModalCloseBtn = document.getElementById('scripts-modal-close-btn');
    const scriptsModalTitulo = document.getElementById('scripts-modal-titulo');
    const scriptsModalLista = document.getElementById('scripts-modal-lista');
    const productCards = document.querySelectorAll('.product-card');

    // Função para abrir o modal com os scripts corretos
    function abrirScriptsModal(servicoId, servicoTitulo) {
        const scripts = scriptsPorServico[servicoId] || [];
        if (!scriptsModal) return;

        scriptsModalTitulo.innerText = `Downloads para ${servicoTitulo}`;
        scriptsModalLista.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

        if (scripts.length > 0) {
            scripts.forEach(script => {
                const item = document.createElement('li');
                item.innerHTML = `<span>${script.nome}</span> <a href="${script.arquivo}" download>Baixar</a>`;
                scriptsModalLista.appendChild(item);
            });
        } else {
            scriptsModalLista.innerHTML = '<li>Nenhum download disponível para este serviço.</li>';
        }
        scriptsModal.classList.add('visivel');
    }

    // Função para fechar o modal
    function fecharScriptsModal() {
        if (scriptsModal) scriptsModal.classList.remove('visivel');
    }

    // Adiciona os eventos de clique para os cards de produto
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const servicoId = card.dataset.service;
            const servicoTitulo = card.querySelector('h2').innerText;
            abrirScriptsModal(servicoId, servicoTitulo);
        });
    });

    // Adiciona os eventos para fechar o modal
    if (scriptsModalCloseBtn) {
        scriptsModalCloseBtn.addEventListener('click', fecharScriptsModal);
    }
    if (scriptsModal) {
        scriptsModal.addEventListener('click', (e) => {
            if (e.target === scriptsModal) fecharScriptsModal();
        });
    }
});