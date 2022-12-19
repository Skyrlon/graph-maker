import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";

const StyledColorPicker = styled(Box)`
  position: relative;

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

export default function ColorPicker({ color, changeColor }) {
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

  return (
    <StyledColorPicker>
      <IconButton
        variant="contained"
        size="medium"
        sx={{
          backgroundColor: color,
          "&:hover": { backgroundColor: color, opacity: 0.75 },
        }}
        onClick={handleClick}
      />
      {displayColorPicker ? (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </StyledColorPicker>
  );
}
