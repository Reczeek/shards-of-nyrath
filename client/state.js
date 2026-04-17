import { STARTING } from "./config.js";

const CLASS_PRESETS = {
  war: {
    name: "Aspekt Wojny",
    hp: 120,
    stats: { VIT: 2, STR: 3, DEF: 2, AGI: 1, INT: 0, unspent: 0 }
  },
  dark: {
    name: "Aspekt Mroku",
    hp: 100,
    stats: { VIT: 1, STR: 1, DEF: 1, AGI: 2, INT: 3, unspent: 0 }
  }
};

export function createDefaultMeta() {
  return {
    essence: STARTING.ESSENCE, // Okruchy Boskości
    unlockedClasses: ["war", "dark"],
    bestFloor: 1
  };
}

export function createNewRun(classId = "war") {
  const preset = CLASS_PRESETS[classId] ?? CLASS_PRESETS.war;

  return {
    startedAt: Date.now(),
    classId,
    className: preset.name,

    floor: STARTING.FLOOR,
    roomIndex: STARTING.ROOM_INDEX, // 1..3
    isBossFloor: false,

    hp: preset.hp,
    maxHp: preset.hp,

    xp: STARTING.XP,
    level: STARTING.LEVEL,
    gold: STARTING.GOLD,

    stats: { ...preset.stats },

    equipment: { weapon: null, armor: null, accessory: null },
    consumables: [],
    runPerks: [],

    deathDefianceUsed: false,

    currentRoomChoices: [],
    flags: {
      lastShopFloor: 0
    }
  };
}