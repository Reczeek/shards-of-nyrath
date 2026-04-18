import { resolveRoom } from "./systems/roomResolver.js";
import { createNewRun } from "./state.js";
import { loadRun, saveRun, clearRun, loadMeta, saveMeta } from "./storage.js";
import { ensureRoomChoices, applyRoomChoice, isRunFinishedForStage1 } from "./systems/floorSystem.js";
import { getRoomTypeLabel } from "./systems/roomSystem.js";


import {checkAndApplyLevelUps, spendStatPoint} from "./systems/levelSystem.js";
 (System statystyk)

const debugEl = document.getElementById("debug");
const floorInfoEl = document.getElementById("floor-info");
const roomInfoEl = document.getElementById("room-info");
const choicesEl = document.getElementById("choices");
const actionLogEl = document.getElementById("action-log");
const btnNewWar = document.getElementById("new-war");
const btnNewDark = document.getElementById("new-dark");
const btnContinue = document.getElementById("continue");
const btnReset = document.getElementById("reset-run");


const levelPanelEl = document.getElementById("levelup-panel");
const unspentInfoEl = document.getElementById("unspent-info");
 (System statystyk)

let meta = loadMeta();
let run = loadRun();


function render() {
  if (run) {
    ensureRoomChoices(run);
    saveRun(run);
  }

  btnContinue.disabled = !run;


  if (run) {
    floorInfoEl.textContent = `Piętro: ${run.floor} ${run.isBossFloor ? "(Boss floor)" : ""}`;
    roomInfoEl.textContent = `Pokój: ${run.roomIndex}/3 | Klasa: ${run.className} | HP: ${run.hp}/${run.maxHp} | XP: ${run.xp} | Złoto: ${run.gold}`;
  } else {
    floorInfoEl.textContent = "Brak aktywnego runa";
    roomInfoEl.textContent = "";
  }


  choicesEl.innerHTML = "";
  if (run?.currentRoomChoices?.length) {
    run.currentRoomChoices.forEach((room, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Opcja ${index + 1}: ${getRoomTypeLabel(room.type)}`;
      btn.style.marginRight = "8px";
      btn.onclick = () => chooseRoom(room);
      choicesEl.appendChild(btn);
    });
  }


  debugEl.textContent = JSON.stringify({ meta, run }, null, 2);
}

function startNewGame(classId) {
  run = createNewRun(classId);
  ensureRoomChoices(run);
  saveRun(run);
  render();
}

function continueRun() {
  run = loadRun();
  if (!run) {
    alert("Brak aktywnego runa.");
    return;
  }
  render();
}

function resetRun() {
  clearRun();
  run = null;
  render();
}

function chooseRoom(room) {
  if (!run) return;

  const roomResult = resolveRoom(run, room);


  actionLogEl.textContent = roomResult.log;


  if (run.hp <= 0) {
    const essenceGain = Math.max(1, Math.floor(run.floor * 1.5));
    meta.essence += essenceGain;
    meta.bestFloor = Math.max(meta.bestFloor, run.floor);
    saveMeta(meta);

    alert(`💀 Zginąłeś na piętrze ${run.floor}. Zdobyto +${essenceGain} Okruchów Boskości.`);
    clearRun();
    run = null;
    render();
    return;
  }


  run = applyRoomChoice(run, room);


  if (isRunFinishedForStage1(run)) {
    meta.bestFloor = Math.max(meta.bestFloor, run.floor - 1);
    saveMeta(meta);

    alert("Gratulacje! Doszedłeś do końca zakresu testowego Etapu 1 (12 pięter).");
    clearRun();
    run = null;
    render();
    return;
  }

  ensureRoomChoices(run);
  saveRun(run);
  render();
}


 (System statystyk)
btnNewWar.addEventListener("click", () => startNewGame("war"));
btnNewDark.addEventListener("click", () => startNewGame("dark"));
btnContinue.addEventListener("click", continueRun);
btnReset.addEventListener("click", resetRun);


// inicjalizacja

levelPanelEl?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-stat]");
  if (!btn || !run) return;

  const stat = btn.dataset.stat;
  const ok = spendStatPoint(run, stat);
  if (!ok) return;

  const left = run.stats?.unspent ?? 0;
  actionLogEl.textContent = `Rozdano punkt: +1 ${stat} (pozostało: ${left})\n` + (actionLogEl.textContent || "");

  saveRun(run);
  render();
});


function render() {
	if (run) {
		ensureRoomChoices(run);
		saveRun(run);
	}
	btnContinue.disabled = !run;
	if (run) {
		floorInfoEl.textContent = `Piętro: ${run.floor} ${run.isBossFloor ? "(Boss floor)" : ""}`;
		roomInfoEl.textContent = `Pokój: ${run.roomIndex}/3 | Klasa: ${run.className} | HP: ${run.hp}/${run.maxHp} | Level: ${run.level} | XP: ${run.xp} | Złoto: ${run.gold}`;
	} else {
		floorInfoEl.textContent = "Brak aktywnego runa";
		roomInfoEl.textContent = "";
	}
	choicesEl.innerHTML = "";
	if (run?.currentRoomChoices?.length) {
		run.currentRoomChoices.forEach((room, index) => {
			const btn = document.createElement("button");
			btn.textContent = `Opcja ${index + 1}: ${getRoomTypeLabel(room.type)}`;
			btn.style.marginRight = "8px";
			const unspent = run?.stats?.unspent ?? 0;
			btn.disabled = unspent > 0;
			if (unspent > 0) {
				btn.title = "Najpierw rozdaj punkty statystyk";
			}
			btn.onclick = () => chooseRoom(room);
			choicesEl.appendChild(btn);
		});
	}
	debugEl.textContent = JSON.stringify({ meta, run }, null, 2);
	renderLevelPanel();
}

function startNewGame(classId) {
  	run = createNewRun(classId);
	ensureRoomChoices(run);
	saveRun(run);
	render();
}

function continueRun() {
	run = loadRun();
	if (!run) {
		alert("Brak aktywnego runa.");
		return;
	}
	render();
}

function resetRun() {
	clearRun();
	run = null;
	render();
}

function chooseRoom(room) {
    if (!run) return;
	const unspent = run.stats?.unspent ?? 0;
	if (unspent > 0) {
		actionLogEl.textContent = `Najpierw rozdaj punkty statystyk (${unspent}) w panelu level up.`;
		return;
	}
    const roomResult = resolveRoom(run, room);
	const levelInfo = checkAndApplyLevelUps(run);
    actionLogEl.textContent = roomResult.log;
	if (levelInfo.leveledUp)   actionLogEl.textContent += `\n🎉 Poziom podniesiony! Aktualny poziom: ${run.level}. Zdobyto ${levelInfo.gainedLevels * 3} punktów statystyk.`;
    if (run.hp <= 0) {
		const essenceGain = Math.max(1, Math.floor(run.floor * 1.5));
		meta.essence += essenceGain;
		meta.bestFloor = Math.max(meta.bestFloor, run.floor);
		saveMeta(meta);
		alert(`💀 Zginąłeś na piętrze ${run.floor}. Zdobyto +${essenceGain} Okruchów Boskości.`);
		clearRun();
		run = null;
		render();
		return;
    }
    run = applyRoomChoice(run, room);
    if (isRunFinishedForStage1(run)) {
        meta.bestFloor = Math.max(meta.bestFloor, run.floor - 1);
        saveMeta(meta);
        alert("Gratulacje! Doszedłeś do końca zakresu testowego Etapu 1 (12 pięter).");
        clearRun();
        run = null;
        render();
        return;
    }

    ensureRoomChoices(run);
    saveRun(run);
    render();
}

function renderLevelPanel() {
  if (!run) {
    levelPanelEl.style.display = "none";
    return;
  }

  const unspent = run.stats?.unspent ?? 0;

  if (unspent > 0) {
    levelPanelEl.style.display = "block";
    unspentInfoEl.textContent = `Punkty do rozdania: ${unspent}`;
  } else {
    levelPanelEl.style.display = "none";
  }
}


 (System statystyk)
saveMeta(meta);
render();