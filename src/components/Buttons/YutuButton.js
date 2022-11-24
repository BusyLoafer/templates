import React from "react";
import { EMPTY } from "../../lib/const";
import "./style.scss"


export default (props) => {

  // ? props
  const {
    text = "",
    btnState = EMPTY,
    onClick = () => { },
    isWord = false,
  } = props;


  return (
    <div
      className="yutuBtn"
      onClick={onClick}
    >
      <div
        className={("y-btn y-btn-" + btnState) + (isWord ? " y-btn-word" : "")}
      >
        {
          text && text.length > 0 &&
          <p
            className={"text " + (isWord ? "word" : "")}
          >{text}</p>
        }
      </div>
    </div>
  );
}