import { createNewRun } from "./state.js";
import { loadRun, saveRun, clearRun, loadMeta, saveMeta } from "./storage.js";
import { ensureRoomChoices, applyRoomChoice, isRunFinishedForStage1 } from "./systems/floorSystem.js";
import { getRoomTypeLabel } from "./systems/roomSystem.js";

const debugEl = document.getElementById("debug");
const floorInfoEl = document.getElementById("floor-info");
const roomInfoEl = document.getElementById("room-info");
const choicesEl = document.getElementById("choices");

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

  // Górny info panel
  if (run) {
    floorInfoEl.textContent = `Piętro: ${run.floor} ${run.isBossFloor ? "(Boss floor)" : ""}`;
    roomInfoEl.textContent = `Pokój: ${run.roomIndex}/3 | Klasa: ${run.className}`;
  } else {
    floorInfoEl.textContent = "Brak aktywnego runa";
    roomInfoEl.textContent = "";
  }

  // Opcje pokoju
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

  // Debug
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

  run = applyRoomChoice(run, room);

  // Testowe "ukończenie Etapu 1"
  if (isRunFinishedForStage1(run)) {
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