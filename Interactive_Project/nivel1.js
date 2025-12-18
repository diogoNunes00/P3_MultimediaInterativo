const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const popup = document.getElementById('popup');
const btnAvancar = document.getElementById('btnAvancar');

// 1. INICIALIZAÇÃO DOS SLOTS
slots.forEach(slot => {
    let content = slot.querySelector('.slot-content');
    if (!content) {
        content = document.createElement('div');
        content.classList.add('slot-content');
        slot.appendChild(content);
    }
    if (!content.querySelector('.fx-heart')) {
        content.insertAdjacentHTML('beforeend', `
            <span class="fx fx-heart">❤️</span>
            <span class="fx fx-ghost">👻</span>
        `);
    }
});

// 2. DRAG START
cards.forEach(card => {
    card.addEventListener('dragstart', e => {
        const usos = parseInt(card.getAttribute('data-uso') || "999");
        if (usos <= 0) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', card.id);
    });
});

// 3. DROP NOS SLOTS
slots.forEach(slot => {
    slot.addEventListener('dragover', e => {
        e.preventDefault();
        slot.classList.add('over');
    });

    slot.addEventListener('dragleave', () => slot.classList.remove('over'));

    slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('over');

        const cardId = e.dataTransfer.getData('text/plain');
        const originalCard = document.getElementById(cardId);
        if (!originalCard) return;

        // --- LÓGICA DE FUNDO ---
        if (originalCard.classList.contains('fundo')) {
            const imgPath = originalCard.getAttribute('data-img');
            slot.style.backgroundImage = `url('${imgPath}')`;
            slot.style.backgroundColor = 'transparent';
            atualizarContador(originalCard);
            avaliarCena();
            return;
        }

        // --- LÓGICA DE PERSONAGEM (CLONE COM POSIÇÃO) ---
        const usosAtuais = parseInt(originalCard.getAttribute('data-uso') || "0");
        if (usosAtuais > 0) {
            const clone = originalCard.cloneNode(true);

            // Atribuímos o ID original ao data-personagem para o CSS posicionar
            clone.setAttribute('data-personagem', originalCard.id);
            clone.removeAttribute('id');

            clone.addEventListener('click', () => {
                clone.remove();
                aplicarEfeitos(slot);
                avaliarCena();
            });

            slot.querySelector('.slot-content').appendChild(clone);
            atualizarContador(originalCard);
            aplicarEfeitos(slot);
            avaliarCena();
        }
    });
});

function atualizarContador(card) {
    let usos = parseInt(card.getAttribute('data-uso'));
    if (isNaN(usos)) return;
    usos--;
    card.setAttribute('data-uso', usos);
    if (usos <= 0) card.classList.add('esgotado');
}

function aplicarEfeitos(slot) {
    const content = slot.querySelector('.slot-content');
    const imgs = Array.from(content.querySelectorAll('img'));

    const temMary = imgs.some(i => i.alt === 'Mary');
    const temMarido = imgs.some(i => i.alt === 'Marido');
    const temMorto = imgs.some(i => i.alt === 'Marido Morto');

    const heart = slot.querySelector('.fx-heart');
    const ghost = slot.querySelector('.fx-ghost');

    if (temMary && temMarido && !temMorto) heart.classList.add('show');
    else heart.classList.remove('show');

    if (temMorto) ghost.classList.add('show');
    else ghost.classList.remove('show');
}

function avaliarCena() {
    const s1 = document.getElementById('slot1').querySelector('.slot-content');
    const s2 = document.getElementById('slot2').querySelector('.slot-content');
    const s3 = document.getElementById('slot3').querySelector('.slot-content');

    const check = (container, alt) => Array.from(container.querySelectorAll('img')).some(i => i.alt === alt);
    const temFundo = (id) => document.getElementById(id).style.backgroundImage !== "";

    const maryCave = temFundo('slot1') && check(s1, 'Mary') && check(s1, 'Perna');
    const ataqueSala = temFundo('slot2') && check(s2, 'Mary') && check(s2, 'Marido') && check(s2, 'Perna');
    const maridoMorto = check(s3, 'Marido Morto');

    if (maryCave && ataqueSala && maridoMorto) {
        exibirFeedback(true, "✅ Final Desbloqueado!", "Mary executou o plano perfeitamente.");
    } else if (maridoMorto && !maryCave) {
        exibirFeedback(false, "❌ Erro Narrativo", "Como o marido morreu sem a Mary ir buscar a arma?");
    }
}

function exibirFeedback(sucesso, titulo, desc) {
    document.getElementById('tituloFinal').textContent = titulo;
    document.getElementById('descricaoFinal').textContent = desc;
    btnAvancar.style.display = sucesso ? 'inline-block' : 'none';
    if (!sucesso) document.body.classList.add('error-bg');
    else document.body.classList.remove('error-bg');
    popup.style.display = 'flex';
}

btnAvancar.addEventListener('click', () => { window.location.href = 'nivel2.html'; });