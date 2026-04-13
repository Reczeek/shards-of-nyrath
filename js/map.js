function generateFloor(floor) {
    const rooms = [];
    const rows = 8;

    for (let y = 0; y < rows; y++) {
        rooms[y] = [];

        for (let x = 0; x < 4; x++) {
            rooms[y][x] = {
                type: 'combat',
                visited: false,
                connections: []
            };
        }
    }

    return {
        rooms,
        rows,
        currentY: 0,
        currentX: 0
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

            mapGrid.appendChild(tile);
        }
    }

    content.appendChild(mapGrid);
}