const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const resultado = document.getElementById('resultado');
const popup = document.getElementById('popup');
const tituloFinal = document.getElementById('tituloFinal');
const descricaoFinal = document.getElementById('descricaoFinal');
const btnAvancar = document.getElementById('btnAvancar');
const contentor = document.getElementById('contentor');

let interacaoFeita = false;

// 1. GARANTE EFEITOS (Igual ao Nível 1)
slots.forEach(slot => {
    let content = slot.querySelector('.slot-content');
    if (!content.querySelector('.fx-heart')) {
        content.insertAdjacentHTML('beforeend', '<span class="fx fx-heart">❤️</span><span class="fx fx-ghost">👻</span>');
    }
});

// 2. DRAG & DROP
cards.forEach(card => {
    card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', card.id);
    });
});

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
        const card = document.getElementById(cardId);
        const content = slot.querySelector('.slot-content');

        if (card.classList.contains('fundo')) {
            slot.style.backgroundColor = card.getAttribute('data-color');
            interacaoFeita = true;
            return;
        }

        if (card.parentElement) card.parentElement.removeChild(card);
        content.appendChild(card);

        interacaoFeita = true;
        avaliarCena();
    });
});

contentor.addEventListener('dragover', e => e.preventDefault());
contentor.addEventListener('drop', e => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    const parentSlot = card.closest('.slot');
    if (card.parentElement) card.parentElement.removeChild(card);
    contentor.appendChild(card);
    if (parentSlot && card.classList.contains('fundo')) parentSlot.style.backgroundColor = '';
    avaliarCena();
});

// 3. AVALIAÇÃO NARRATIVA
function avaliarCena() {
    if (!interacaoFeita) return;

    const s1 = document.getElementById('slot1');
    const s2 = document.getElementById('slot2');
    const s3 = document.getElementById('slot3');

    const s1Content = s1.querySelector('.slot-content');
    const s2Content = s2.querySelector('.slot-content');
    const s3Content = s3.querySelector('.slot-content');

    // Lógica de Vitória:
    // Slot 1: Cozinha + Perna Assada | Slot 2: Polícias a comer | Slot 3: Mary a rir
    const condicao1 = s1Content.contains(document.getElementById('pernaAssada')) && s1.style.backgroundColor !== '';
    const condicao2 = s2Content.contains(document.getElementById('policiasComendo'));
    const condicao3 = s3Content.contains(document.getElementById('marySorrindo'));

    if (condicao1 && condicao2 && condicao3) {
        resultado.textContent = '✅';
        document.body.classList.remove('error-bg');
        tituloFinal.textContent = 'O Crime Perfeito!';
        descricaoFinal.textContent = '"Está mesmo debaixo dos nossos narizes", dizem os polícias enquanto devoram a arma do crime. Mary sorri na sala ao lado.';
        btnAvancar.style.display = 'block';
        popup.style.display = 'flex';
    } else {
        // Feedback de erro (igual ao Nível 1)
        resultado.textContent = '❌';
        document.body.classList.add('error-bg');
    }
}

btnAvancar.addEventListener('click', () => {
    window.location.href = 'index.html'; // Volta ao início
});ddEventListener('click', () => window.location.href = 'index.html');