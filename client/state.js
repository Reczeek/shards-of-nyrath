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

export function createNewRun(classId) {
  return {
    classId,
    floor: 1,
    roomIndex: 1,
    isBossFloor: false,
    currentRoomChoices: null,
    lastResolvedRoom: null,
    hp: 100,
    maxHp: 100,
    xp: 0,
    gold: 0,
    level: 1,
    stats: {
      unspent: 0,
      vit: 0,
      str: 0,
      def: 0,
      agi: 0,
      int: 0
    },
    shopVisitedThisFloor: false,
    shopsSinceLast: 0,
    nextGuaranteedShopIn: 2,
    combat: null,
  };
}
