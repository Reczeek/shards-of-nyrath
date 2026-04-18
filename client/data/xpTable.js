
export const XPTABLE = [];

export const XP_THRESHOLDS = [
  0, 120, 300, 560, 900, 1320, 1820, 2400, 3060, 3800,
  4620, 5520, 6500, 7560, 8700, 9920, 11220, 12600, 14060, 15600,
  17220, 18920, 20700, 22560, 24500, 26520, 28620, 30800, 33060, 35400, 37820
];

export function getLevelForXP(totalXp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}
