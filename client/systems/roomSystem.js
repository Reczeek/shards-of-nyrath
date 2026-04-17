const ROOM_TYPES = ["fight", "event", "treasure", "shop"];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  // Na boss floor, pokój 3 = zawsze boss (bez wyboru)
  if (bossFloor && isThirdRoom) {
    return [
      { type: "boss", id: crypto.randomUUID?.() ?? String(Date.now()) }
    ];
  }

  // Normalnie: 2 losowe opcje
  const choiceA = { type: randomFrom(ROOM_TYPES), id: crypto.randomUUID?.() ?? String(Date.now() + 1) };
  const choiceB = { type: randomFrom(ROOM_TYPES), id: crypto.randomUUID?.() ?? String(Date.now() + 2) };

  return [choiceA, choiceB];
}