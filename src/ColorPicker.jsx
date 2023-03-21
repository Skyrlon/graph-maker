import { IconButton } from "@mui/material";
import { useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";

const StyledColorPicker = styled.div`
  position: relative;

  & .button-text {
    color:${(props) => props.textColor};
    font-size:0.75rem;
  }

  & .popover {
    position: absolute;
    z-index: 2;
  }

  & .cover {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
},`;

export default function ColorPicker({ color, changeColor, children }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    changeColor(color.hex);
  };

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  function setContrast(rgb) {
    const brightness = Math.round(
      (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    );
    return brightness > 125 ? "black" : "white";
  }

  return (
    <StyledColorPicker textColor={setContrast(hexToRgb(color))}>
      <IconButton
        variant="contained"
        size="medium"
        sx={{
          width: "1.25rem",
          height: "1.25rem",
          backgroundColor: color,
          border: "1px solid",
          "&:hover": { backgroundColor: color, opacity: 0.75 },
        }}
        onClick={handleClick}
      >
        <span className="button-text">{children}</span>
      </IconButton>

      {displayColorPicker ? (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </StyledColorPicker>
  );
}
