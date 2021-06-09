import Dice from "../components/dice";
import Coin from "../components/coin";
import { useRecoilValue } from "recoil";
import { allBlockState } from "../recoil/atoms";

/**
 * Component for showing the coins in winning state in HomeCenter.
 * @param {Object} props
 * @returns JSX
 */
function HomeCenterCoins({ parent, style }) {
  const blockState = useRecoilValue(allBlockState);
  const key = `${parent[0]}-won`;

  return (
    <div className="homeCenterCoin" style={style}>
      {blockState &&
        blockState[key] &&
        blockState[key].map((item, i) => (
          <Coin key={i} parent={parent} index={item} className="haveWon" />
        ))}
    </div>
  );
}

/**
 * Component for the center of the board that stores COIN in winning state.
 * @returns JSX
 */
function HomeCenter() {
  return (
    <div className="homeCenter">
      <div>
        <HomeCenterCoins parent="yellow" />
      </div>
      <div>
        <HomeCenterCoins
          parent="palegreen"
          style={{ transform: "rotate(90deg)" }}
        />
        <Dice />
        <HomeCenterCoins
          parent="royalblue"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <div>
        <HomeCenterCoins parent="tomato" />
      </div>
    </div>
  );
}

export default HomeCenter;
