export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MAX_GAUGE = 100;
const TICK_MS = 100;
const BASE_PLAYER_FILL = 8;
const BASE_ENEMY_FILL = 6;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function calcFill(base, agi) {
  return base + Math.floor(agi / 8);
}

function rollQte(zoneStart = 42, zoneEnd = 58) {
  const roll = randInt(1, 100);
  if (roll >= zoneStart && roll <= zoneEnd) return "perfect";
  if (roll >= zoneStart - 10 && roll <= zoneEnd + 10) return "good";
  return "miss";
}

function qteAttackMultiplier(result) {
  if (result === "perfect") return 1;
  if (result === "good") return 0.75;
  return 0.5;
}

function qteDefenseMultiplier(result) {
  if (result === "perfect") return 0;
  if (result === "good") return 0.5;
  return 1;
}

function createEnemyByFloor(floor, idx = 0) {
  const hpBase = 40 + floor * 3;
  const atkBase = 8 + Math.floor(floor * 0.9);
  const defBase = 3 + Math.floor(floor * 0.4);
  const agiBase = 8 + Math.floor(floor * 0.35);

  return {
    id: crypto.randomUUID?.() ?? String(Date.now() + idx),
    name: `Wróg ${idx + 1}`,
    hp: hpBase + randInt(-6, 8),
    maxHp: hpBase + randInt(-6, 8),
    atk: atkBase + randInt(-2, 3),
    def: defBase + randInt(-1, 2),
    agi: agiBase + randInt(-2, 2),
    gauge: 0,
    alive: true
  };
}

export function createBattleState(run, options = {}) {
  const isBoss = !!options.isBoss;
  const enemyCount = isBoss ? 1 : randInt(1, 3);

  const enemies = Array.from({ length: enemyCount }, (_, i) =>
    createEnemyByFloor(run.floor, i)
  );

  if (isBoss && enemies[0]) {
    enemies[0].name = `Boss ${run.floor}`;
    enemies[0].maxHp = Math.floor(enemies[0].maxHp * 2.4);
    enemies[0].hp = enemies[0].maxHp;
    enemies[0].atk = Math.floor(enemies[0].atk * 1.35);
    enemies[0].def = Math.floor(enemies[0].def * 1.25);
    enemies[0].agi = Math.floor(enemies[0].agi * 1.1);
  }

  return {
    active: true,
    isBoss,
    tickMs: TICK_MS,
    player: {
      hp: run.hp,
      maxHp: run.maxHp,
      atk: run.atk ?? 12,
      def: run.def ?? 6,
      agi: run.agi ?? 10,
      gauge: 0,
      canAct: false,
      skillUsesLeft: 2,
    },
    enemies,
    pendingEnemyActionId: null,
    winner: null,
    log: []
  };
}

export function stepBattle(state) {
  if (!state.active) return state;

  if (state.pendingEnemyActionId) return state;

  if (!state.player.canAct) {
    const playerFill = calcFill(BASE_PLAYER_FILL, state.player.agi);
    state.player.gauge = clamp(state.player.gauge + playerFill, 0, MAX_GAUGE);
    if (state.player.gauge >= MAX_GAUGE) {
      state.player.canAct = true;
      state.player.gauge = MAX_GAUGE;
    }
  }

  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    const enemyFill = calcFill(BASE_ENEMY_FILL, enemy.agi);
    enemy.gauge = clamp(enemy.gauge + enemyFill, 0, MAX_GAUGE);
    if (enemy.gauge >= MAX_GAUGE) {
      state.pendingEnemyActionId = enemy.id;
      break;
    }
  }

  const livingEnemies = state.enemies.filter(e => e.alive);
  if (livingEnemies.length === 0) {
    state.active = false;
    state.winner = "player";
  } else if (state.player.hp <= 0) {
    state.active = false;
    state.winner = "enemies";
  }

  return state;
}

export function playerAttack(state, targetId) {
  if (!state.active || !state.player.canAct) return state;

  const target = state.enemies.find(e => e.id === targetId && e.alive);
  if (!target) return state;

  const qte = rollQte();
  const mult = qteAttackMultiplier(qte);
  const raw = Math.max(1, state.player.atk - target.def + randInt(-2, 3));
  const dmg = Math.max(1, Math.floor(raw * mult));

  target.hp = Math.max(0, target.hp - dmg);
  if (target.hp <= 0) target.alive = false;

  state.log.push(`Atak (${qte}): -${dmg} HP ${target.name}`);

  state.player.gauge = 0;
  state.player.canAct = false;

  const livingEnemies = state.enemies.filter(e => e.alive);
  if (livingEnemies.length === 0) {
    state.active = false;
    state.winner = "player";
  }

  return state;
}

export function resolveEnemyAction(state) {
  if (!state.active || !state.pendingEnemyActionId) return state;

  const enemy = state.enemies.find(e => e.id === state.pendingEnemyActionId && e.alive);
  state.pendingEnemyActionId = null;

  if (!enemy) return state;

  const qte = rollQte();
  const mult = qteDefenseMultiplier(qte);
  const raw = Math.max(1, enemy.atk - state.player.def + randInt(-2, 3));
  const dmg = Math.max(0, Math.floor(raw * mult));

  state.player.hp = Math.max(0, state.player.hp - dmg);
  enemy.gauge = 0;

  state.log.push(`${enemy.name} atakuje (${qte}): -${dmg} HP`);

  if (state.player.hp <= 0) {
    state.active = false;
    state.winner = "enemies";
  }

  return state;
}

export function finalizeBattleToRun(run, state) {
  run.hp = state.player.hp;

  if (state.winner === "player") {
    const baseXp = state.isBoss ? randInt(55, 80) : randInt(14, 22);
    const baseGold = state.isBoss ? randInt(40, 65) : randInt(10, 18);
    const floorBonus = Math.floor(run.floor * 0.7);

    run.xp += baseXp + floorBonus;
    run.gold += baseGold + floorBonus;

    return {
      won: true,
      lost: false,
      xpGain: baseXp + floorBonus,
      goldGain: baseGold + floorBonus,
      hpAfter: run.hp
    };
  }

  return {
    won: false,
    lost: true,
    xpGain: 0,
    goldGain: 0,
    hpAfter: run.hp
  };
}

export function playerSkill(state, targetId) {
  if (!state.active || !state.player.canAct) return state;
  if ((state.player.skillUsesLeft ?? 0) <= 0) return state;

  const target = state.enemies.find(e => e.id === targetId && e.alive);
  if (!target) return state;

  const qte = rollQte();
  const mult = qteAttackMultiplier(qte);

  const raw = Math.max(1, Math.floor(state.player.atk * 1.6) - target.def + randInt(-1, 4));
  const dmg = Math.max(1, Math.floor(raw * mult));

  target.hp = Math.max(0, target.hp - dmg);
  if (target.hp <= 0) target.alive = false;

  state.player.skillUsesLeft -= 1;
  state.log.push(`Skill (${qte}): -${dmg} HP ${target.name} | Pozostało użyć: ${state.player.skillUsesLeft}`);

  state.player.gauge = 0;
  state.player.canAct = false;

  const livingEnemies = state.enemies.filter(e => e.alive);
  if (livingEnemies.length === 0) {
    state.active = false;
    state.winner = "player";
  }

  return state;
}