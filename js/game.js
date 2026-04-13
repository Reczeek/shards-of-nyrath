let gameState = {
    player: null,
    floor: 1,
    room: 0,
    phase: 'map'
};

function startGame() {
    gameState.map = generateFloor(gameState.floor);
    renderMap();
}

function generateFloor(floor) {
    const size = 15;
    const grid = [];

    for (let y = 0; y < size; y++) {
        grid[y] = [];
        for (let x = 0; x < size; x++) {
            grid[y][x] = { type: 'wall' };
        }
    }

    for (let y = 5; y < 10; y++) {
        for (let x = 5; x < 10; x++) {
            grid[y][x] = { type: 'floor' };
        }
    }

    return {
        grid,
        size,
        playerX: 7,
        playerY: 7
    };
}

function renderMap() {
    const content = document.getElementById('game-content');
    content.innerHTML = '';

    const mapGrid = document.createElement('div');
    mapGrid.id = 'map-grid';

    for (let y = 0; y < gameState.map.size; y++) {
        for (let x = 0; x < gameState.map.size; x++) {
            const cell = gameState.map.grid[y][x];

            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.classList.add('tile-' + cell.type);

            if (x === gameState.map.playerX && y === gameState.map.playerY) {
                tile.innerHTML = '▲';
            }

            mapGrid.appendChild(tile);
        }
    }

    content.appendChild(mapGrid);
}

document.addEventListener('keydown', (e) => {
    let x = gameState.map.playerX;
    let y = gameState.map.playerY;

    if (e.key === 'w') y--;
    if (e.key === 's') y++;
    if (e.key === 'a') x--;
    if (e.key === 'd') x++;

    const cell = gameState.map.grid[y][x];

    if (cell.type === 'floor') {
        gameState.map.playerX = x;
        gameState.map.playerY = y;
        renderMap();
    }
});

gameState.floor = 1;
gameState.map = null;