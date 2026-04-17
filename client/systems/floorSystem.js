import { GAME_LIMITS } from "../config.js";
import { generateRoomChoices, isBossFloor } from "./roomSystem.js";

export function ensureRoomChoices(run) {
  if (!run.currentRoomChoices || run.currentRoomChoices.length === 0) {
    run.isBossFloor = isBossFloor(run.floor);
    run.currentRoomChoices = generateRoomChoices(run);
  }
  return run;
}

export function applyRoomChoice(run, chosenRoom) {
  // Tu na razie tylko "symulujemy" ukończenie pokoju
  // Realne efekty walk/event/sklep dodamy w kolejnych krokach
  run.lastResolvedRoom = chosenRoom.type;

  // Czy pokój 3?
  const isLastRoomOnFloor = run.roomIndex >= GAME_LIMITS.ROOMS_PER_FLOOR;

  if (!isLastRoomOnFloor) {
    run.roomIndex += 1;
  } else {
    run.floor += 1;
    run.roomIndex = 1;
  }

  run.currentRoomChoices = [];
  run.isBossFloor = isBossFloor(run.floor);

  return run;
}

export function isRunFinishedForStage1(run) {
  return run.floor > GAME_LIMITS.TEST_MAX_FLOOR;
}