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
    content.insertAdjacentHTML('beforeend', '<span class="fx fx-heart">❤️</span><span class="fx fx-ghost"></span>');
});

// Lógica de Drag & Drop com Clonagem e Limite Invisível
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

        // Lógica de Fundo (Apenas pinta)
        if (originalCard.classList.contains('fundo')) {
            slot.style.backgroundColor = originalCard.getAttribute('data-color');
            atualizarContadorInvisivel(originalCard);
            avaliarCena();
            return;
        }

        // Lógica de Personagem: Criação de CLONE
        const usosAtuais = parseInt(originalCard.getAttribute('data-uso'));
        if (usosAtuais > 0) {
            const clone = originalCard.cloneNode(true);
            clone.removeAttribute('id');

            // Remover do slot ao clicar
            clone.addEventListener('click', () => {
                clone.remove();
                avaliarCena();
            });

            slot.querySelector('.slot-content').appendChild(clone);
            atualizarContadorInvisivel(originalCard);
            aplicarEfeitosSlot(slot);
            avaliarCena();
        }
    });
});

// Atualiza o atributo de dados sem mexer no DOM visível (removemos a parte do badge)
function atualizarContadorInvisivel(card) {
    let usos = parseInt(card.getAttribute('data-uso'));
    usos--;
    card.setAttribute('data-uso', usos);

    // Se chegar a zero, desativa o arrasto e aplica estilo visual cinzento
    if (usos <= 0) {
        card.classList.add('esgotado');
        card.draggable = false;
    }
}

// Lógica de Avaliação
function avaliarCena() {
    const s1 = document.getElementById('slot1').querySelector('.slot-content');
    const s2 = document.getElementById('slot2').querySelector('.slot-content');
    const s3 = document.getElementById('slot3').querySelector('.slot-content');

    const check = (slot, altText) => Array.from(slot.querySelectorAll('img')).some(i => i.alt === altText);

    const maryCave = check(s1, 'Mary') && check(s1, 'Perna');
    const ataqueSala = check(s2, 'Mary') && check(s2, 'Perna') && check(s2, 'Marido');
    const mortoFim = check(s3, 'Marido Morto');

    if (maryCave && ataqueSala && mortoFim) {
        exibirFeedback(true, "✅ Sucesso!", "Parabéns! Reconstituíste a história corretamente.");
    } else if (mortoFim && !maryCave) {
        exibirFeedback(false, "❌ Erro Narrativo", "A Mary precisa de obter a arma primeiro!");
    }
}

function aplicarEfeitosSlot(slot) {
    const content = slot.querySelector('.slot-content');
    const temMary = Array.from(content.querySelectorAll('img')).some(i => i.alt === 'Mary');
    const temMarido = Array.from(content.querySelectorAll('img')).some(i => i.alt === 'Marido');
    const heart = slot.querySelector('.fx-heart');
    if (temMary && temMarido) heart?.classList.add('show');
    else heart?.classList.remove('show');
}

function exibirFeedback(sucesso, titulo, desc) {
    document.getElementById('tituloFinal').textContent = titulo;
    document.getElementById('descricaoFinal').textContent = desc;
    btnAvancar.style.display = sucesso ? 'inline-block' : 'none';
    popup.style.display = 'flex';
}

btnAvancar.addEventListener('click', () => { window.location.href = 'LambToTheSlaughter.html'; });