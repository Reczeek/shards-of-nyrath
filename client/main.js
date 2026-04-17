import { createNewRun } from "./state.js";
import { loadRun, saveRun, clearRun, loadMeta, saveMeta } from "./storage.js";

const debugEl = document.getElementById("debug");
const btnNewWar = document.getElementById("new-war");
const btnNewDark = document.getElementById("new-dark");
const btnContinue = document.getElementById("continue");
const btnReset = document.getElementById("reset-run");

let meta = loadMeta();
let run = loadRun();

function renderDebug() {
  debugEl.textContent = JSON.stringify({ meta, run }, null, 2);
  btnContinue.disabled = !run;
}

function startNewGame(classId) {
  run = createNewRun(classId);
  saveRun(run);
  renderDebug();
  alert(`Nowy run: ${run.className}`);
}

function continueRun() {
  run = loadRun();
  if (!run) {
    alert("Brak aktywnego runa.");
    return;
  }
  renderDebug();
  alert(`Kontynuujesz run: piętro ${run.floor}, pokój ${run.roomIndex}`);
}

function resetRun() {
  clearRun();
  run = null;
  renderDebug();
  alert("Aktywny run usunięty.");
}

// TEST: szybkie dodanie okruchów (sprawdzenie meta)
function addEssenceTest(amount = 5) {
  meta.essence += amount;
  saveMeta(meta);
}

btnNewWar.addEventListener("click", () => startNewGame("war"));
btnNewDark.addEventListener("click", () => startNewGame("dark"));
btnContinue.addEventListener("click", continueRun);
btnReset.addEventListener("click", resetRun);

// jednorazowy test:
addEssenceTest(0);
renderDebug();