import React from "react";
import "./styles/arrow-slider-style.css";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

const Arrows = () => {
  const executeScrollUp = () =>
    window.scrollBy({
      top: -100,
      left: 0,
      behavior: "smooth",
    });
  const executeScrollDown = () =>
    window.scrollBy({
      top: 100,
      left: 0,
      behavior: "smooth",
    });
  return (
    <div className="col-lg-1 col-md-0 col-sm-0">
      <div className="button-container">
        <div className="arrow-up-container">
          <button onClick={executeScrollUp}>
            <Arrow className="arrow-up" />
          </button>
        </div>
        <div className="arrow-down-conatiner">
          <button onClick={executeScrollDown}>
            <Arrow className="arrow-down" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Arrows;
