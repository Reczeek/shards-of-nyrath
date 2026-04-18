import { randInt } from "./combatSystem.js";

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

export function pickRoomType() {
  const roll = randInt(1, 100);

  if (roll <= 52) return "fight";
  if (roll <= 74) return "event";
  if (roll <= 92) return "treasure";
  return "shop";
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

  const mustOfferShop =
    run.shopsSinceLast >= run.nextGuaranteedShopIn &&
    !(bossFloor && isThirdRoom);

  if (mustOfferShop) {
    const nonShopPool = ["fight", "event", "treasure"];
    const otherType = nonShopPool[randInt(0, nonShopPool.length - 1)];
    const shopFirst = Math.random() < 0.5;

    if (shopFirst) {
      return [
        { type: "shop", id: crypto.randomUUID?.() ?? String(Date.now() + 1) },
        { type: otherType, id: crypto.randomUUID?.() ?? String(Date.now() + 2) }
      ];
    }

    return [
      { type: otherType, id: crypto.randomUUID?.() ?? String(Date.now() + 1) },
      { type: "shop", id: crypto.randomUUID?.() ?? String(Date.now() + 2) }
    ];
  }

  let typeA = pickRoomType();
  let typeB = pickRoomType();

  if (typeA === "shop" && typeB === "shop") {
    const nonShopPool = ["fight", "event", "treasure"];
    typeB = nonShopPool[randInt(0, nonShopPool.length - 1)];
  }

  const choiceA = { type: typeA, id: crypto.randomUUID?.() ?? String(Date.now() + 1) };
  const choiceB = { type: typeB, id: crypto.randomUUID?.() ?? String(Date.now() + 2) };

  return [choiceA, choiceB];
}