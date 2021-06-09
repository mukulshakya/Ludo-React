import { useRecoilValue } from "recoil";
import {
  allCoinState,
  currentDiceState,
  currentPlayerState,
  currentPlayersListState,
} from "../recoil/atoms";
import Coin from "./coin";

// This component is for 4 blocks that stores COIN in initial state.
function HomeBox({ parent }) {
  const coinState = useRecoilValue(allCoinState);
  const currentPlayer = useRecoilValue(currentPlayerState);
  const playersList = useRecoilValue(currentPlayersListState);

  // const currentDiceNum = useRecoilValue(currentDiceState);

  return (
    <div className={"homeBox"}>
      {currentPlayer === parent && <div className={"homeBoxOverlay"}></div>}
      {Array(4)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className={"homeBoxInner"}
            style={{ border: `20px solid ${parent}` }}
          >
            {playersList.includes(parent) &&
              coinState[parent][parent[0] + i].position === "home" && (
                <Coin parent={parent} index={parent[0] + i} />
              )}
          </div>
        ))}
    </div>
  );
}

export default HomeBox;
