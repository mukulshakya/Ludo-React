import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentDiceState, currentPlayerState } from "../recoil/atoms";
import diceRollSound from "../assets/diceRoll2.mp3";

/**
 * Component for DICE.
 * @returns JSX
 */
function Dice() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [diceState, setDiceState] = useRecoilState(currentDiceState);
  const currentPlayer = useRecoilValue(currentPlayerState);

  // Generates random dice value between 1 and 6
  const rotateDice = () =>
    setDiceState({
      // num: 6,
      num: Math.ceil(Math.random() * 6),
      isLocked: true,
      lastRolledBy: currentPlayer,
    });

  // Event handler for dice onClick
  const onClick = () => {
    if (!isAnimating && !diceState.isLocked) {
      setDiceState({ num: 0, isLocked: false, lastRolledBy: currentPlayer });
      setIsAnimating(true);

      new Audio(diceRollSound).play();

      setTimeout(() => {
        rotateDice();
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div
      className={"dice" + (isAnimating ? " dice-animation" : "")}
      onClick={onClick}
      style={{
        gridTemplateColumns: diceState.num > 1 ? "repeat(2, 1fr)" : "1fr",
      }}
    >
      {Array(diceState.num)
        .fill()
        .map((_, i) => (
          <div key={i}>
            <div style={{ backgroundColor: currentPlayer }}></div>
          </div>
        ))}
    </div>
  );
}

export default Dice;
