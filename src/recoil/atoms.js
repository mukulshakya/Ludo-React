import { atom } from "recoil";

export const currentPlayersListState = atom({
  key: "currentPlayersListState",
  default: [],
});

export const currentPlayerState = atom({
  key: "currentPlayerState",
  default: "",
});

export const currentDiceState = atom({
  key: "currentDiceState",
  default: { num: 0, isLocked: false, lastRolledBy: null },
});

/**
 * Posible values:
 * "home" - initial state
 * "won" - coin entered won state
 */
export const allCoinState = atom({
  key: "allCoinState",
  default: {
    palegreen: {
      p0: { position: "home", isTurnAvailable: true },
      p1: { position: "home", isTurnAvailable: true },
      p2: { position: "home", isTurnAvailable: true },
      p3: { position: "home", isTurnAvailable: true },
    },
    yellow: {
      y0: { position: "home", isTurnAvailable: true },
      y1: { position: "home", isTurnAvailable: true },
      y2: { position: "home", isTurnAvailable: true },
      y3: { position: "home", isTurnAvailable: true },
    },
    royalblue: {
      r0: { position: "home", isTurnAvailable: true },
      r1: { position: "home", isTurnAvailable: true },
      r2: { position: "home", isTurnAvailable: true },
      r3: { position: "home", isTurnAvailable: true },
    },
    tomato: {
      t0: { position: "home", isTurnAvailable: true },
      t1: { position: "home", isTurnAvailable: true },
      t2: { position: "home", isTurnAvailable: true },
      t3: { position: "home", isTurnAvailable: true },
    },
  },
});

export const allBlockState = atom({
  key: "allBlockState",
  default: {
    // t30: ["t0", "p1"],
    // "r-won": ["r0", "r1"],
    // r51: ["r2"],
  },
});
