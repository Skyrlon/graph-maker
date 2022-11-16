import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useRef, useState } from "react";
import { useEffect } from "react";

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

  const [imgSize, setImgSize] = useState(400);
  const [imgType, setImgType] = useState("png");
  const [fileName, setFileName] = useState("");
  const [imgDataURL, setImgDataUrl] = useState("");
  const [imgFileSize, setImgFileSize] = useState("");

  const drawInlineSVG = () => {
    const imgName = svgData.title.trim().length > 0 ? svgData.title : "graph";
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
      setImgDataUrl(dataURL);
      setFileName(`${imgName}.${imgType}`);
      const head = "data:image/png;base64,";
      const fileSize = Math.round(((dataURL.length - head.length) * 3) / 4);

      if (fileSize < 0) {
        setImgFileSize("0 o");
      } else {
        let power = 0;
        const symbolArray = ["", "K", "M", "G", "T"];
        while (fileSize > Math.pow(1024, power)) {
          power++;
        }
        setImgFileSize(
          `${Math.round((fileSize / Math.pow(1024, power - 1)) * 100) / 100} ${
            symbolArray[power - 1]
          }o`
        );
      }
    };

    img.src = url;
  };

  const download = () => {
    var link = document.createElement("a");
    link.download = fileName;
    link.style.opacity = "0";
    canvasRef.current.append(link);
    link.href = imgDataURL;
    link.click();
    link.remove();
  };

  useEffect(
    () => {
      if (svgData.node) {
        drawInlineSVG();
      }
    },
    // eslint-disable-next-line
    [svgData, imgSize, imgType]
  );

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
      <Button onClick={download}>Download</Button>
      <Typography>≈{imgFileSize}</Typography>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </StyledDownloadSection>
  );
}

export default DownloadSection;
