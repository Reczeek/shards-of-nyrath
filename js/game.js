let gameState = {
    player: null,
    floor: 1,
    map: null,
    phase: 'map'
};

function startGame() {
    gameState.map = generateFloor(gameState.floor);
    updateHud();
    renderMap();
}