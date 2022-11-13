import { Button, MenuItem, Select, TextField } from "@mui/material";
import styled from "styled-components";
import { useRef, useState } from "react";

const StyledDownloadSection = styled.section`
  grid-area: save;
  border: 1px solid;
  position: relative;
  #canvas {
    position: absolute;
    width: 1px;
    height: 1px;
  }
`;

function DownloadSection({ svgData }) {
  const canvasRef = useRef();

  const [imgSize, setImgSize] = useState("");
  const [imgType, setImgType] = useState("png");

  function drawInlineSVG() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const svgText = svgData.node.outerHTML;
    const svg = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      domURL = window.URL || window.webkitURL || window,
      url = domURL.createObjectURL(svg),
      img = new Image();

    img.onload = function () {
      canvas.width = imgSize;
      canvas.height = imgSize;
      if (imgType !== "png") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, imgSize, imgSize);
      }
      ctx.drawImage(
        img,
        0,
        0,
        svgData.width,
        svgData.height,
        0,
        0,
        imgSize,
        imgSize
      );
      domURL.revokeObjectURL(url);
      const dataURL = canvas.toDataURL(`image/${imgType}`);
      download(dataURL, `image.${imgType}`, canvas);
    };

    img.src = url;
  }

  function download(href, name, canvas) {
    var link = document.createElement("a");
    link.download = name;
    link.style.opacity = "0";
    canvas.append(link);
    link.href = href;
    link.click();
    link.remove();
  }

  return (
    <StyledDownloadSection>
      <TextField
        label="Image Size"
        value={imgSize}
        onChange={(e) => setImgSize(e.target.value)}
      ></TextField>
      <Select value={imgType} onChange={(e) => setImgType(e.target.value)}>
        <MenuItem value={"png"}>PNG</MenuItem>
        <MenuItem value={"jpeg"}>JPEG</MenuItem>
        <MenuItem value={"bmp"}>BMP</MenuItem>
      </Select>
      <Button onClick={drawInlineSVG}>Download</Button>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </StyledDownloadSection>
  );
}

export default DownloadSection;
