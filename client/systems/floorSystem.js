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

  if (chosenRoom.type === "shop") {
    run.shopVisitedThisFloor = true;
    run.shopsSinceLast = 0;
    run.nextGuaranteedShopIn = randInt(2, 3);
  }

  run.lastResolvedRoom = chosenRoom.type;
  const isLastRoomOnFloor = run.roomIndex >= GAME_LIMITS.ROOMS_PER_FLOOR;

  if (!isLastRoomOnFloor) {
    run.roomIndex += 1;
  } else {

    if (!run.shopVisitedThisFloor) {
      run.shopsSinceLast += 1;
    }

    run.floor += 1;
    run.roomIndex = 1;
    run.shopVisitedThisFloor = false;
  }

  run.currentRoomChoices = null;
  run.isBossFloor = isBossFloor(run.floor);
  return run;
}

export function isRunFinishedForStage1(run) {
    return run.floor > GAME_LIMITS.TEST_MAX_FLOOR;
}

export function advanceAfterRoom(run) {
    const wasThirdRoom = run.roomIndex === 3;

    if (wasThirdRoom) {
      run.floor += 1;
      run.roomIndex = 1;
    } else {
      run.roomIndex += 1;
    }

    return run;
}