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
    gameState.player = createPlayer(cls);
    showScreen('screen-game');
    updateHud();
    startGame();
}

document.getElementById('btn-back-menu').addEventListener('click', () => {
    showScreen('screen-menu');
});

function updateHud() {
    const p = gameState.player;
    document.getElementById('hud-class-icon').innerHTML = p.classIcon;
    document.getElementById('hud-class-name').innerHTML = p.className;
    document.getElementById('hud-hp-text').innerHTML = p.hp + ' / ' + p.maxHp;
    document.getElementById('hud-hp-fill').style.width = (p.hp / p.maxHp * 100) + '%';
    document.getElementById('hud-floor').innerHTML = 'Piętro ' + gameState.floor;
    document.getElementById('hud-gold').innerHTML = '✦ ' + p.gold;
    document.getElementById('hud-level').innerHTML = 'Poziom ' + p.level;
}