const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const resultado = document.getElementById('resultado');
const popup = document.getElementById('popup');
const tituloFinal = document.getElementById('tituloFinal');
const descricaoFinal = document.getElementById('descricaoFinal');
const btnAvancar = document.getElementById('btnAvancar');
const contentor = document.getElementById('contentor');

let interacaoFeita = false;

// 1. INICIALIZAÇÃO DE EFEITOS (Igual ao Nível 1)
slots.forEach(slot => {
    let content = slot.querySelector('.slot-content') || (slot.innerHTML = '<div class="slot-content"></div>', slot.querySelector('.slot-content'));
    if (!content.querySelector('.fx-heart')) {
        content.insertAdjacentHTML('beforeend', '<span class="fx fx-heart">❤️</span><span class="fx fx-ghost">👻</span>');
    }
});

// 2. DRAG & DROP LOGIC
cards.forEach(card => {
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', card.id));
});

slots.forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('over'));
    slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('over');
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        const content = slot.querySelector('.slot-content');

        if (card.classList.contains('fundo')) {
            slot.style.backgroundColor = card.getAttribute('data-color');
        } else {
            if (card.parentElement) card.parentElement.removeChild(card);
            content.appendChild(card);
        }
        interacaoFeita = true;
        aplicarEfeitosSlot(slot);
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

// 3. AUXILIARES
function tiposNoSlot(slot) {
    const content = slot.querySelector('.slot-content');
    return Array.from(content.children).map(el => {
        const id = el.id ? el.id.toLowerCase() : '';
        if (id.includes('policia')) return 'policia';
        if (id.includes('mary')) return 'mary';
        if (id.includes('morto')) return 'morto';
        return null;
    }).filter(Boolean);
}

function aplicarEfeitosSlot(slot) {
    const tipos = tiposNoSlot(slot);
    const ghost = slot.querySelector('.fx-ghost');
    // O fantasma aparece perto do corpo morto
    if (tipos.includes('morto') && ghost) ghost.classList.add('show');
}

function avaliarCena() {
    if (!interacaoFeita) return;

    const s1 = document.getElementById('slot1').querySelector('.slot-content');
    const s2 = document.getElementById('slot2').querySelector('.slot-content');
    const s3 = document.getElementById('slot3').querySelector('.slot-content');

    // Condições: 1. Polícias com o corpo | 2. Polícias a buscar | 3. Mary com Polícias
    const c1 = s1.contains(document.getElementById('maridoMorto')) && (s1.contains(document.getElementById('policia1')) || s1.contains(document.getElementById('policia2')));
    const c2 = (s2.contains(document.getElementById('policia1')) || s2.contains(document.getElementById('policia2'))) && document.getElementById('slot2').style.backgroundColor !== '';
    const c3 = (s3.contains(document.getElementById('maryChora')) && (s3.contains(document.getElementById('policia1')) || s3.contains(document.getElementById('policia2'))));

    if (c1 && c2 && c3) {
        resultado.textContent = '✅';
        document.body.classList.remove('error-bg');
        tituloFinal.textContent = 'Sem pistas!';
        descricaoFinal.textContent = 'Os polícias estão exaustos e não encontraram nada. Mary convida-os para o jantar.';
        btnAvancar.style.display = 'block';
        popup.style.display = 'flex';
    } else {
        document.body.classList.add('error-bg');
        resultado.textContent = '❌';
    }
}

btnAvancar.addEventListener('click', () => window.location.href = 'nivel4.html');