const ROOM_WEIGHTS = {
  fight: 50,
  event: 20,
  treasure: 20,
  shop: 10
};

function weightedPick(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;

  for (const [type, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return type;
  }

  return entries[entries.length - 1][0];
}

function pickRoomType() {
  return weightedPick(ROOM_WEIGHTS);
}

export function isBossFloor(floor) {
  return floor % 4 === 0;
}

export function getRoomTypeLabel(type) {
  switch (type) {
    case "fight": return "⚔️ Walka";
    case "event": return "❓ Event";
    case "treasure": return "💰 Skarbiec";
    case "shop": return "🏪 Sklep";
    case "boss": return "👑 Boss";
    default: return "Nieznany";
  }
}

export function generateRoomChoices(run) {
  const bossFloor = isBossFloor(run.floor);
  const isThirdRoom = run.roomIndex === 3;

  if (bossFloor && isThirdRoom) {
    return [
      { type: "boss", id: crypto.randomUUID?.() ?? String(Date.now()) }
    ];
  }

  const choiceA = { type: pickRoomType(), id: crypto.randomUUID?.() ?? String(Date.now() + 1) };
  const choiceB = { type: pickRoomType(), id: crypto.randomUUID?.() ?? String(Date.now() + 2) };

  return [choiceA, choiceB];
}