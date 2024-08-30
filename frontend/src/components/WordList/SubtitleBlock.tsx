import React from "react";

const SubtitleBlock = ({ text, onWordClick }) => {
  const words = text.split(" ");

  return (
    <div
      className="subtitle-block"
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="subtitle-word"
          onClick={() => onWordClick(word, words)}
          style={{ cursor: "pointer", margin: "0 2px" }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default SubtitleBlock;
