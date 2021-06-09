import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import _ from "lodash";

import {
  currentPlayerState,
  allCoinState,
  allBlockState,
  currentDiceState,
  currentPlayersListState,
} from "../recoil/atoms";
import { startMoves, moves, starIndexes, colorMap } from "../config/constants";
import coinPalegreen from "../assets/coinPalegreen.svg";
import coinYellow from "../assets/coinYellow.svg";
import coinTomato from "../assets/coinTomato.svg";
import coinRoyalblue from "../assets/coinRoyalblue.svg";
import coinMoveSound from "../assets/coinMove.mp3";

const images = {
  palegreen: coinPalegreen,
  yellow: coinYellow,
  tomato: coinTomato,
  royalblue: coinRoyalblue,
};

/**
 * Component for COIN that moves over entire board.
 * @param {Object} props
 * @returns JSX
 */
function Coin({ parent, index, className }) {
  const [currentPlayer, setCurrentPlayer] = useRecoilState(currentPlayerState);
  const [coinState, setCoinState] = useRecoilState(allCoinState);
  const [blockState, setBlockState] = useRecoilState(allBlockState);
  const [diceState, setDiceState] = useRecoilState(currentDiceState);
  const playersList = useRecoilValue(currentPlayersListState);

  const { position: currentPosition, isTurnAvailable } =
    coinState[parent][index];

  // checks if the current position of coin is not home or won
  const isPositionNotHomeOrWon = ["home", "won"].every(
    (x) => !currentPosition.includes(x)
  );

  const parentMoves = moves[parent];
  // Calculate next possible move for current coin
  const nextMove = isPositionNotHomeOrWon
    ? diceState.num &&
      parentMoves.indexOf(currentPosition) + diceState.num < parentMoves.length
      ? parentMoves[parentMoves.indexOf(currentPosition) + diceState.num]
      : null
    : currentPosition === "home"
    ? startMoves[parent]
    : "";

  // Check with nextMove & diceNum; if the coin can move or not
  const moveableClass =
    currentPlayer === parent && nextMove
      ? // (!currentPosition && nextMove) ||
        // currentPosition === nextMove
        // ? ""
        // :
        isTurnAvailable
        ? isPositionNotHomeOrWon || diceState.num === 6
          ? " current-player-animation"
          : ""
        : isPositionNotHomeOrWon && diceState.num
        ? " current-player-animation"
        : ""
      : "";

  /**
   * This useEffect tracks the dice change and accordingly sets `isTurnAvailable`
   * and also changes the player if next moe is not possible
   */
  useEffect(() => {
    const currentPlayerCoins = coinState[parent];

    if (diceState.num && currentPlayer === parent) {
      const updatedState = _.cloneDeep(currentPlayerCoins);
      let moveAvailCount = 0;

      Object.keys(updatedState).forEach((key) => {
        const position = updatedState[key].position;
        if (
          (position === "home" && diceState.num === 6) ||
          (["home", "won"].every((x) => !position.includes(x)) &&
            parentMoves.indexOf(position) + diceState.num < parentMoves.length)
        ) {
          console.log({ position });
          updatedState[key].isTurnAvailable = true;
          moveAvailCount++;
        } else {
          updatedState[key].isTurnAvailable = false;
        }
      });

      console.log({ moveAvailCount });

      setCoinState({ ...coinState, [parent]: updatedState });
      !moveAvailCount && changePlayer();
    }
  }, [diceState.num]);

  /**
   * This function updates the coin and block states accordingly, also checks if either of the coin is being killed by other.
   * @param {String} parentKey              The nextMove the current coin should move to.
   * @param {Object} updatedFullCoinState   Updated entire coin state object.
   * @param {Object} updatedFullBlockState  Updated entire block state object.
   * @param {Function} cb                   Should be called with a parameter i.e; number coins that have killed by some other coin.
   * @returns void
   */
  const updateCoinBlockStates = (
    parentKey,
    updatedFullCoinState,
    updatedFullBlockState,
    cb
  ) => {
    setCoinState(updatedFullCoinState);
    setBlockState(updatedFullBlockState);
    updatedFullCoinState = _.cloneDeep(updatedFullCoinState);
    let updatedBlockState = [];
    let coinsToBeReset = [];
    let isStateUpdated = false;

    const currentState = updatedFullBlockState[parentKey];
    if (!starIndexes.includes(parentKey) && currentState.length > 1) {
      currentState.forEach((elem) => {
        const allMatched = updatedBlockState.every((item) =>
          item.startsWith(elem[0])
        );
        if (allMatched) updatedBlockState.push(elem);
        else {
          coinsToBeReset.push(...updatedBlockState);
          updatedBlockState = [elem];
        }
      });

      if (coinsToBeReset.length)
        coinsToBeReset.forEach((key) => {
          updatedFullCoinState[colorMap[key[0]]][key].position = "home";
        });

      isStateUpdated = true;
    }

    if (isStateUpdated) {
      setCoinState(updatedFullCoinState);
      setBlockState({
        ...updatedFullBlockState,
        [parentKey]: [...new Set(updatedBlockState)],
      });
    }
    return cb(!!coinsToBeReset.length);
  };

  // Changes the player to next possible
  const changePlayer = () => {
    const currentPlayerIndex = playersList.indexOf(currentPlayer);
    const nextPlayer =
      currentPlayerIndex === -1 || !playersList[currentPlayerIndex + 1]
        ? playersList[0]
        : playersList[currentPlayerIndex + 1];

    setTimeout(() => {
      setDiceState({ num: 0, isLocked: false, lastRolledBy: currentPlayer });
      setCurrentPlayer(nextPlayer);
    }, 500);
  };

  /**
   * This function is called as a event handler onClick on coin.
   * Updates the coin positions and changes the player if required.
   * @returns void
   */
  const playTurn = () => {
    // prevent other player's coin moving on click when turn in of other
    if (parent !== currentPlayer || !diceState.num || !moveableClass) return;

    // const { position: currentPosition } = coinState[parent][index];

    // if (!nextMove) return changePlayer();

    new Audio(coinMoveSound).play();

    const updatedCoinState = _.cloneDeep({
      ...coinState[parent],
      [index]: { position: nextMove, isTurnAvailable: false },
    });

    const updatedBlockState = _.cloneDeep(blockState);

    isPositionNotHomeOrWon &&
      updatedBlockState[currentPosition].splice(
        updatedBlockState[currentPosition].indexOf(index),
        1
      );
    updatedBlockState[nextMove] = [
      ...new Set([...(blockState[nextMove] || []), index]),
    ];

    updateCoinBlockStates(
      nextMove,
      { ...coinState, [parent]: updatedCoinState },
      updatedBlockState,
      (isKilledSomeone) => {
        !isKilledSomeone &&
          !nextMove.includes("won") &&
          diceState.num !== 6 &&
          changePlayer();
        setDiceState({ num: 0, isLocked: false, lastRolledBy: currentPlayer });
      }
    );
  };

  return (
    <div
      className={"coin" + moveableClass}
      onClick={playTurn}
      // parent={parent}
      // index={index}
      // isMoveable={moveableClass}
    >
      <img src={images[parent]} className={className} />
    </div>
  );
}

export default Coin;
