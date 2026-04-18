export function resolveRoom(run, room) {
  const result = {
    log: "",
    hpChange: 0,
    goldChange: 0,
    xpChange: 0
  };

  const floorScale = Math.floor(run.floor * 0.6);

  switch (room.type) {
    case "fight": {
      const enemyStrength = Math.max(1, Math.floor(run.floor / 2));
      const dmgTaken = randInt(5, 11) + enemyStrength;                
      const xp = randInt(10, 16) + floorScale + enemyStrength;          
      const gold = randInt(8, 14) + floorScale;                       
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

      // 30% heal, 35% gold, 35% trap (bardziej ryzykowne)
      if (roll <= 30) {
        const heal = randInt(6, 14);                                    
        run.hp = Math.min(run.maxHp, run.hp + heal);
        result.log = `❓ Event (łaska): +${heal} HP`;
        result.hpChange = heal;
      } else if (roll <= 65) {
        const gold = randInt(10, 24) + Math.floor(run.floor * 0.4);   
        run.gold += gold;
        result.log = `❓ Event (znalezisko): +${gold} złota`;
        result.goldChange = gold;
      } else {
        const dmg = randInt(7, 15) + Math.floor(run.floor * 0.3);      
        run.hp = Math.max(0, run.hp - dmg);
        result.log = `❓ Event (pułapka): -${dmg} HP`;
        result.hpChange = -dmg;
      }
      break;
    }

    case "treasure": {
      const gold = randInt(16, 32) + Math.floor(run.floor * 0.5);     
      const heal = randInt(0, 8);                                         

      run.gold += gold;
      run.hp = Math.min(run.maxHp, run.hp + heal);

      result.log = `💰 Skarbiec: +${gold} złota${heal > 0 ? `, +${heal} HP` : ""}`;
      result.goldChange = gold;
      result.hpChange = heal;
      break;
    }

    case "shop": {
        const cost = 30;
        const heal = 26;

        if (run.gold >= cost) {
          run.gold -= cost;
          const before = run.hp;
          run.hp = Math.min(run.maxHp, run.hp + heal);
          const realHeal = run.hp - before;

          result.log = `🏪 Sklep: kupiono leczenie za ${cost} złota (+${realHeal} HP)`;
          result.goldChange = -cost;
          result.hpChange = realHeal;
        } else {
          result.log = `🏪 Sklep: brak złota na zakup (koszt ${cost}).`;
        }
        break;
      }

    case "boss": {
      const dmgTaken = randInt(16, 26) + Math.floor(run.floor / 3);       
      const xp = randInt(36, 56) + run.floor;                             
      const gold = randInt(28, 48) + Math.floor(run.floor / 2);

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