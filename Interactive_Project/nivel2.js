const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const popup = document.getElementById('popup');
const btnAvancar = document.getElementById('btnAvancar');

// 1. INICIALIZAÇÃO DOS SLOTS (Igual ao Nível 1)
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

        // Lógica de Fundo (Imagem de cenário)
        if (originalCard.classList.contains('fundo')) {
            const imgPath = originalCard.getAttribute('data-img');
            slot.style.backgroundImage = `url('${imgPath}')`;
            slot.style.backgroundColor = 'transparent';
            atualizarContador(originalCard);
            avaliarCena();
            return;
        }

        // Lógica de Personagem (Clonagem)
        const usosAtuais = parseInt(originalCard.getAttribute('data-uso'));
        if (usosAtuais > 0) {
            const clone = originalCard.cloneNode(true);
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

// 4. FUNÇÕES DE SUPORTE
function atualizarContador(card) {
    let usos = parseInt(card.getAttribute('data-uso'));
    if (isNaN(usos)) return;
    usos--;
    card.setAttribute('data-uso', usos);
    if (usos <= 0) {
        card.classList.add('esgotado');
        card.draggable = false;
    }
}

function aplicarEfeitos(slot) {
    const content = slot.querySelector('.slot-content');
    const imgs = Array.from(content.querySelectorAll('img'));
    const temMary = imgs.some(i => i.alt === 'Mary');
    const temForno = imgs.some(i => i.alt === 'Forno');

    const heart = slot.querySelector('.fx-heart');
    if (temMary && temForno) heart?.classList.add('show');
    else heart?.classList.remove('show');
}

// 5. AVALIAÇÃO NARRATIVA DO NÍVEL 2
function avaliarCena() {
    const s1 = document.getElementById('slot1').querySelector('.slot-content');
    const s2 = document.getElementById('slot2').querySelector('.slot-content');
    const s3 = document.getElementById('slot3').querySelector('.slot-content');

    const check = (slot, altText) => Array.from(slot.querySelectorAll('img')).some(i => i.alt === altText);
    const temFundo = (id) => document.getElementById(id).style.backgroundImage !== "";

    // CONDIÇÕES:
    // Slot 1: Mary na Cozinha
    const maryNaCozinha = temFundo('slot1') && check(s1, 'Mary');
    // Slot 2: Perna de Cordeiro dentro do Forno
    const pernaNoForno = check(s2, 'Perna') && check(s2, 'Forno');
    // Slot 3: Mary aguarda (Alibi concluído)
    const maryAguarda = check(s3, 'Mary');

    if (maryNaCozinha && pernaNoForno && maryAguarda) {
        exibirFeedback(true, "✅ Álibi Perfeito!", "Mary colocou a arma no forno. O crime agora está a assar e ninguém suspeitará de nada.");
    } else if (pernaNoForno && !maryNaCozinha) {
        exibirFeedback(false, "❌ Erro Narrativo", "A Mary precisa de estar na cozinha para ligar o forno e preparar o jantar!");
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

btnAvancar.addEventListener('click', () => { window.location.href = 'nivel3.html'; });