function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

document.getElementById('btn-newgame').addEventListener('click', () => {
    showScreen('screen-class');
    renderClasses();
});

function renderClasses() {
    const list = document.getElementById('class-list');
    list.innerHTML = '';
    CLASSES.forEach(cls => {
        const card = document.createElement('div');
        card.classList.add('class-card');
        if (!cls.unlocked) card.classList.add('locked');
        card.innerHTML = `
            <div class="class-icon">${cls.icon}</div>
            <div class="class-name">${cls.name}</div>
            <div class="class-desc">${cls.unlocked ? cls.description : '???'}</div>
        `;
        if (cls.unlocked) {
            card.addEventListener('click', () => {
                selectClass(cls);
            });
        }
        list.appendChild(card);
    })
}

function selectClass(cls) {
    console.log('Selected class:', cls.name);
    showScreen('screen-game');
}

document.getElementById('btn-back-menu').addEventListener('click', () => {
    showScreen('screen-menu');
});