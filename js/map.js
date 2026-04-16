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

    return { grid, size, playerX: 7, playerY: 7 };
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

            mapGrid.appendChild(tile);
        }
    }

    content.appendChild(mapGrid);
}