import { resolveRoom } from "./systems/roomResolver.js";
import { createNewRun } from "./state.js";
import { loadRun, saveRun, clearRun, loadMeta, saveMeta } from "./storage.js";
import { ensureRoomChoices, applyRoomChoice, isRunFinishedForStage1 } from "./systems/floorSystem.js";
import { getRoomTypeLabel } from "./systems/roomSystem.js";
import {
  createBattleState,
  stepBattle,
  playerAttack,
  playerSkill,
  resolveEnemyAction,
  finalizeBattleToRun
} from "./systems/combatSystem.js";
import { spendStatPoint } from "./systems/levelSystem.js";

let meta = loadMeta();
let run = loadRun();
let combatInterval = null;

/** menu visible only when true */
let isInMainMenu = !run;

const debugEl = document.getElementById("debug");
const floorInfoEl = document.getElementById("floor-info");
const roomInfoEl = document.getElementById("room-info");
const choicesEl = document.getElementById("choices");
const actionLogEl = document.getElementById("action-log");
const btnNewGame = document.getElementById("new-game");
const classSelectEl = document.getElementById("class-select");
const btnContinue = document.getElementById("continue");
const btnReset = document.getElementById("reset-run");
const combatActionsEl = document.getElementById("combat-actions");
const statusPanelEl = document.getElementById("status-panel");
const actionsPanelEl = document.getElementById("actions-panel");
const mainMenuEl = document.getElementById("main-menu");

const levelPanelEl = document.getElementById("levelup-panel");
const unspentInfoEl = document.getElementById("unspent-info");

function renderTopButtons() {
  if (isInMainMenu) {
    btnContinue.style.display = "inline-block";
    btnNewGame.style.display = "inline-block";
    classSelectEl.style.display = "none";
    btnReset.style.display = "none";
  } else {
    btnContinue.style.display = "none";
    btnNewGame.style.display = "none";
    classSelectEl.style.display = "none";
    btnReset.style.display = "inline-block";
  }
}

function render() {
  if (run) {
    ensureRoomChoices(run);
    saveRun(run);
  }

  if (mainMenuEl) mainMenuEl.style.display = isInMainMenu ? "flex" : "none";
  if (statusPanelEl) statusPanelEl.style.display = isInMainMenu ? "none" : "block";
  if (actionsPanelEl) actionsPanelEl.style.display = isInMainMenu ? "none" : "block";

  renderTopButtons();
  btnContinue.disabled = !loadRun();

  if (run && !isInMainMenu) {
    floorInfoEl.textContent = `Piętro: ${run.floor} ${run.isBossFloor ? "(Boss floor)" : ""}`;
    roomInfoEl.textContent = `Pokój: ${run.roomIndex}/3 | Klasa: ${run.className} | HP: ${run.hp}/${run.maxHp} | XP: ${run.xp} | Złoto: ${run.gold}`;
  } else {
    floorInfoEl.textContent = "";
    roomInfoEl.textContent = "";
  }

  choicesEl.innerHTML = "";
  combatActionsEl.innerHTML = "";

  if (run?.currentRoomChoices?.length && !run.combat && !isInMainMenu) {
    run.currentRoomChoices.forEach((room, index) => {
      const btn = document.createElement("button");
      btn.textContent = `Opcja ${index + 1}: ${getRoomTypeLabel(room.type)}`;
      btn.style.marginRight = "8px";
      btn.onclick = () => chooseRoom(room);
      choicesEl.appendChild(btn);
    });
  }

  if (run?.combat?.active && !isInMainMenu) {
    const c = run.combat;
    const enemiesAlive = c.enemies.filter((e) => e.alive);
    const enemyLine = enemiesAlive.map((e) => `${e.name} ${e.hp}/${e.maxHp} [${e.gauge}]`).join(" | ");

    roomInfoEl.textContent =
      `WALKA | HP: ${c.player.hp}/${c.player.maxHp} [${c.player.gauge}] | Wrogowie: ${enemyLine}`;

    const logs = (c.log || []).slice(-5).join("\n");
    actionLogEl.textContent = logs || "Walka trwa...";

    if (c.player.canAct) {
      enemiesAlive.forEach((enemy) => {
        const atkBtn = document.createElement("button");
        atkBtn.textContent = `Atakuj: ${enemy.name}`;
        atkBtn.style.marginRight = "8px";
        atkBtn.onclick = () => {
          if (!run?.combat?.active) return;
          if (!run?.combat?.player?.canAct) return;
          playerAttack(run.combat, enemy.id);
          saveRun(run);
          render();
        };
        combatActionsEl.appendChild(atkBtn);

        const skillBtn = document.createElement("button");
        skillBtn.textContent = `Skill: ${enemy.name} (${c.player.skillUsesLeft})`;
        skillBtn.style.marginRight = "8px";
        skillBtn.disabled = (c.player.skillUsesLeft ?? 0) <= 0;
        skillBtn.onclick = () => {
          if (!run?.combat?.active) return;
          if (!run?.combat?.player?.canAct) return;
          playerSkill(run.combat, enemy.id);
          saveRun(run);
          render();
        };
        combatActionsEl.appendChild(skillBtn);
      });
    }
  }

  if (levelPanelEl && unspentInfoEl) {
    const unspent = run?.stats?.unspent ?? 0;
    levelPanelEl.style.display = !isInMainMenu && run && unspent > 0 ? "block" : "none";
    unspentInfoEl.textContent = `Liczba dostępnych punktów statystyk: ${unspent}`;
  }
  if (debugEl) {
  debugEl.style.display = isInMainMenu ? "none" : "block";
  debugEl.textContent = JSON.stringify({ meta, run, isInMainMenu }, null, 2);
}
 

function startNewGame(classId) {
  isInMainMenu = false;
  run = createNewRun(classId);
  ensureRoomChoices(run);
  saveRun(run);
  render();
}

function continueRun() {
  const loaded = loadRun();
  if (!loaded) {
    alert("Brak aktywnego runa.");
    return;
  }
  run = loaded;
  isInMainMenu = false;
  render();
}

function resetRun() {
  stopCombatLoop();
  clearRun();
  run = null;
  isInMainMenu = true;
  actionLogEl.textContent = "Run zakończony.";
  render();
}

function openClassSelect() {
  isInMainMenu = true;
  classSelectEl.style.display = "block";
  btnContinue.style.display = "none";
  btnNewGame.style.display = "none";
  btnReset.style.display = "none";
}

function chooseRoom(room) {
  if (!run) return;

  if (room.type === "fight" || room.type === "boss") {
    run = applyRoomChoice(run, room);
    run.combat = createBattleState(run, { isBoss: room.type === "boss" });
    actionLogEl.textContent = `⚔️ Rozpoczęto walkę: ${room.type === "boss" ? "Boss" : "Fight"}`;
    saveRun(run);
    startCombatLoop();
    render();
    return;
  }

  const roomResult = resolveRoom(run, room);
  actionLogEl.textContent = roomResult.log;

  if (run.hp <= 0) {
    const essenceGain = Math.max(1, Math.floor(run.floor * 1.5));
    meta.essence += essenceGain;
    meta.bestFloor = Math.max(meta.bestFloor, run.floor);
    saveMeta(meta);

    actionLogEl.textContent = `💀 Zginąłeś na piętrze ${run.floor}. Zdobyto +${essenceGain} Okruchów Boskości.`;

    clearRun();
    run = null;
    isInMainMenu = true;
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
    isInMainMenu = true;
    render();
    return;
  }

  ensureRoomChoices(run);
  saveRun(run);
  render();
}

function stopCombatLoop() {
  if (combatInterval) {
    clearInterval(combatInterval);
    combatInterval = null;
  }
}

function startCombatLoop() {
  stopCombatLoop();

  combatInterval = setInterval(() => {
    if (!run?.combat) {
      stopCombatLoop();
      return;
    }

    stepBattle(run.combat);

    if (run.combat.pendingEnemyActionId) {
      resolveEnemyAction(run.combat);
    }

    if (!run.combat.active && run.combat.winner) {
      const summary = finalizeBattleToRun(run, run.combat);
      const logs = (run.combat.log || []).slice(-6).join("\n");

      if (summary.lost || run.hp <= 0) {
        const essenceGain = Math.max(1, Math.floor(run.floor * 1.5));
        meta.essence += essenceGain;
        meta.bestFloor = Math.max(meta.bestFloor, run.floor);
        saveMeta(meta);

        actionLogEl.textContent =
          `${logs}\n💀 Przegrana. Zginąłeś na piętrze ${run.floor}. +${essenceGain} Okruchów Boskości.`;

        run.combat = null;
        stopCombatLoop();
        clearRun();
        run = null;
        isInMainMenu = true;
        render();
        return;
      }

      actionLogEl.textContent =
        `${logs}\n✅ Wygrana! +${summary.xpGain} XP, +${summary.goldGain} złota.`;

      run.combat = null;
      stopCombatLoop();

      if (isRunFinishedForStage1(run)) {
        meta.bestFloor = Math.max(meta.bestFloor, run.floor - 1);
        saveMeta(meta);

        alert("Gratulacje! Doszedłeś do końca zakresu testowego Etapu 1 (12 pięter).");
        clearRun();
        run = null;
        isInMainMenu = true;
        render();
        return;
      }

      ensureRoomChoices(run);
      saveRun(run);
      render();
      return;
    }

    saveRun(run);
    render();
  }, 100);
}

btnContinue.addEventListener("click", continueRun);
btnReset.addEventListener("click", resetRun);
btnNewGame?.addEventListener("click", openClassSelect);

classSelectEl?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-class]");
  if (!btn) return;
  startNewGame(btn.dataset.class);
});

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


render();
}