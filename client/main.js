import { resolveRoom } from "./systems/roomResolver.js";
import { createNewRun } from "./state.js";
import { loadRun, saveRun, clearRun, loadMeta, saveMeta } from "./storage.js";
import { ensureRoomChoices, applyRoomChoice, isRunFinishedForStage1 } from "./systems/floorSystem.js";
import { getRoomTypeLabel } from "./systems/roomSystem.js";

const debugEl = document.getElementById("debug");
const floorInfoEl = document.getElementById("floor-info");
const roomInfoEl = document.getElementById("room-info");
const choicesEl = document.getElementById("choices");
const actionLogEl = document.getElementById("action-log");
const btnNewWar = document.getElementById("new-war");
const btnNewDark = document.getElementById("new-dark");
const btnContinue = document.getElementById("continue");
const btnReset = document.getElementById("reset-run");

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

btnNewWar.addEventListener("click", () => startNewGame("war"));
btnNewDark.addEventListener("click", () => startNewGame("dark"));
btnContinue.addEventListener("click", continueRun);
btnReset.addEventListener("click", resetRun);

// inicjalizacja
saveMeta(meta);
render();