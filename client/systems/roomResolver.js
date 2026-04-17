export function resolveRoom(run, room) {
  const result = {
    log: "",
    hpChange: 0,
    goldChange: 0,
    xpChange: 0
  };

  switch (room.type) {
    case "fight": {
      const enemyStrength = Math.max(1, Math.floor(run.floor / 2));
      const dmgTaken = randInt(4, 10) + enemyStrength;
      const xp = randInt(12, 20) + enemyStrength * 2;
      const gold = randInt(8, 16) + enemyStrength;

      run.hp = Math.max(0, run.hp - dmgTaken);
      run.xp += xp;
      run.gold += gold;

      result.log = `⚔️ Walka: -${dmgTaken} HP, +${xp} XP, +${gold} złota`;
      result.hpChange = -dmgTaken;
      result.xpChange = xp;
      result.goldChange = gold;
      break;
    }

    case "event": {
      const roll = randInt(1, 100);

      if (roll <= 35) {
        const heal = randInt(8, 18);
        run.hp = Math.min(run.maxHp, run.hp + heal);
        result.log = `❓ Event (łaska): +${heal} HP`;
        result.hpChange = heal;
      } else if (roll <= 70) {
        const gold = randInt(15, 35);
        run.gold += gold;
        result.log = `❓ Event (znalezisko): +${gold} złota`;
        result.goldChange = gold;
      } else {
        const dmg = randInt(6, 14);
        run.hp = Math.max(0, run.hp - dmg);
        result.log = `❓ Event (pułapka): -${dmg} HP`;
        result.hpChange = -dmg;
      }
      break;
    }

    case "treasure": {
      const gold = randInt(20, 45);
      const heal = randInt(0, 12);

      run.gold += gold;
      run.hp = Math.min(run.maxHp, run.hp + heal);

      result.log = `💰 Skarbiec: +${gold} złota${heal > 0 ? `, +${heal} HP` : ""}`;
      result.goldChange = gold;
      result.hpChange = heal;
      break;
    }

    case "shop": {
      const cost = 25;
      const heal = 30;

      if (run.gold >= cost) {
        run.gold -= cost;
        const before = run.hp;
        run.hp = Math.min(run.maxHp, run.hp + heal);
        const realHeal = run.hp - before;
        result.log = `🏪 Sklep: kupiono leczenie za ${cost} złota (+${realHeal} HP)`;
        result.goldChange = -cost;
        result.hpChange = realHeal;
      } else {
        result.log = `🏪 Sklep: za mało złota (potrzeba ${cost})`;
      }
      break;
    }

    case "boss": {
      const dmgTaken = randInt(14, 24) + Math.floor(run.floor / 3);
      const xp = randInt(45, 70) + run.floor;
      const gold = randInt(35, 60) + Math.floor(run.floor / 2);

      run.hp = Math.max(0, run.hp - dmgTaken);
      run.xp += xp;
      run.gold += gold;

      result.log = `👑 Boss: -${dmgTaken} HP, +${xp} XP, +${gold} złota`;
      result.hpChange = -dmgTaken;
      result.xpChange = xp;
      result.goldChange = gold;
      break;
    }

    default:
      result.log = "Brak efektu pokoju.";
  }

  return result;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}