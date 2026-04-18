export function addXP(amount){
  console.log('xp', amount);
}

import {getLevelForXP} from "../data/xpTable.js";

export function checkAndApplyLevelUps(run) {
    const currentLevel = getLevelForXP(run.xp);
    if (currentLevel > run.level) {
        const gainedLevels = currentLevel - run.level;
        run.level = currentLevel;
        run.stats.unspent += gainedLevels * 3;
        return {levelUp: true, gainedLevels};
    }
    return {levelUp: false, gainedLevels: 0};
}

export function spendStatPoint(run, statKey) {
	if (run == null) return false
	if (run.stats == null) return false
	if (run.stats.unspent == undefined) run.stats.unspent = 0
	if (run.stats.unspent <= 0) return false
	const validStats = ["VIT", "STR", "DEF", "AGI", "INT"];
	if (!validStats.includes(statKey)) return false
	if (typeof run.stats[statKey] !== "number" ) run.stats[statKey] = 0; 
	run.stats[statKey] += 1;
	run.stats.unspent -= 1;
	if (statKey === "VIT") {
		run.maxHp += 12;
		run.hp += 12;
		if (run.hp > run.maxHp) run.hp = run.maxHp;
	}
	return true
}

