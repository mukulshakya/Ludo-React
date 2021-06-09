import { useRecoilValue } from "recoil";
import _ from "lodash";

import {
  markColorIndexes,
  markStarIndexes,
  colorMap,
} from "../config/constants";
import { allBlockState } from "../recoil/atoms";
import Coin from "./coin";
import StarBg from "../assets/starOutline3.png";

/**
 * Component that holds the single step of the entire border steps grid.
 * @param {Object} props
 * @returns JSX
 */
function StepsBox({ parent, adjacentDirection, index }) {
  const blockState = useRecoilValue(allBlockState);
  const parentKey = parent[0] + index;

  const style = {
    backgroundImage: markStarIndexes[adjacentDirection].markIndex.includes(
      index
    )
      ? `url(${StarBg})`
      : "",
    backgroundColor: markColorIndexes[adjacentDirection].markIndex.includes(
      index
    )
      ? parent
      : "transparent",
  };

  return (
    <div className="stepBox" style={style}>
      <div style={{ position: "absolute" }}>{parent[0] + index}</div>
      {blockState[parentKey] &&
        blockState[parentKey].map((elem, i) => {
          return <Coin key={i} parent={colorMap[elem[0]]} index={elem} />;
        })}
    </div>
  );
}

export default StepsBox;
