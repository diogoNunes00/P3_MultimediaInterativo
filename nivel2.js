// Seletores base
const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
const popup = document.getElementById('popup');
const btnAvancar = document.getElementById('btnAvancar');

// Inicialização dos slots
slots.forEach(slot => {
    let content = slot.querySelector('.slot-content');
    if (!content) {
        content = document.createElement('div');
        content.classList.add('slot-content');
        slot.appendChild(content);
    }
});

// Drag & Drop
cards.forEach(card => {
    card.addEventListener('dragstart', e => {
        const usos = parseInt(card.getAttribute('data-uso'));
        if (usos <= 0) {
            e.preventDefault();
            return;
        }
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
        const originalCard = document.getElementById(cardId);
        if (!originalCard) return;

        // Fundo
        if (originalCard.classList.contains('fundo')) {
            slot.style.backgroundColor = originalCard.getAttribute('data-color');
            atualizarContadorInvisivel(originalCard);
            avaliarCena();
            return;
        }

        // Personagem/Objeto
        const usosAtuais = parseInt(originalCard.getAttribute('data-uso'));
        if (usosAtuais > 0) {
            const clone = originalCard.cloneNode(true);
            clone.removeAttribute('id');

            clone.addEventListener('click', () => {
                clone.remove();
                avaliarCena();
            });

            slot.querySelector('.slot-content').appendChild(clone);
            atualizarContadorInvisivel(originalCard);
            avaliarCena();
        }
    });
});

// Atualiza contador invisível
function atualizarContadorInvisivel(card) {
    let usos = parseInt(card.getAttribute('data-uso'));
    usos--;
    card.setAttribute('data-uso', usos);

    if (usos <= 0) {
        card.classList.add('esgotado');
        card.draggable = false;
    }
}

// Avaliação da cena
function avaliarCena() {
    const s1 = document.getElementById('slot1').querySelector('.slot-content');
    const s2 = document.getElementById('slot2').querySelector('.slot-content');
    const s3 = document.getElementById('slot3').querySelector('.slot-content');

    const check = (slot, altText) => Array.from(slot.querySelectorAll('img')).some(i => i.alt === altText);

    const preparar = check(s1, 'Mary') && check(s1, 'Perna Crua');
    const cozinhar = check(s2, 'Perna Crua') && s2.style.backgroundColor === '#8B0000';
    const final = check(s3, 'Perna Assada');

    if (preparar && cozinhar && final) {
        exibirFeedback(true, "✅ Sucesso!", "Mary cozinhou a perna do cordeiro corretamente!");
    } else if (final && !preparar) {
        exibirFeedback(false, "❌ Erro Narrativo", "A Mary precisa de preparar a carne primeiro!");
    }
}

function exibirFeedback(sucesso, titulo, desc) {
    document.getElementById('tituloFinal').textContent = titulo;
    document.getElementById('descricaoFinal').textContent = desc;
    btnAvancar.style.display = sucesso ? 'inline-block' : 'none';
    popup.style.display = 'flex';
}

btnAvancar.addEventListener('click', () => { window.location.href = 'LambToTheSlaughter.html'; });
