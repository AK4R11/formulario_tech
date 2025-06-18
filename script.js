// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO FORMULÁRIO ---
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
                    alert('Obrigado pelo seu contato! Formulário enviado com sucesso.');
                    form.reset();
                } else {
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
        mostrarBanner();
        setInterval(proximoBanner, 5000);
    }
});