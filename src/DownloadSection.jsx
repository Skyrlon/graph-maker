import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useRef, useState } from "react";
import { useEffect } from "react";

const StyledDownloadSection = styled.section`
  grid-area: save;
  border: 1px solid;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 2%;

  & .download-inputs {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: center;

    & > * {
      width: 25%;
    }
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
    height: 33%;
    box-sizing: border-box;
    padding: 5%;

    & .download-inputs {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 50%;

      & > * {
        width: 100%;
      }
    }
  }

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
  const [imgFileSize, setImgFileSize] = useState("0 o");
  const [imgQuality, setImgQuality] = useState(100);

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
      const dataURL = canvas.toDataURL(`image/${imgType}`, imgQuality / 100);
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
    [svgData, imgSize, imgType, imgQuality]
  );

  return (
    <StyledDownloadSection>
      <Box className="download-inputs">
        <TextField
          label="Image Size"
          value={imgSize}
          onChange={(e) => setImgSize(e.target.value)}
          InputProps={{
            endAdornment: imgSize > 0 && (
              <InputAdornment position="end">x {imgSize}px</InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Format"
          value={imgType}
          onChange={(e) => setImgType(e.target.value)}
        >
          <MenuItem value={"png"}>PNG</MenuItem>
          <MenuItem value={"jpeg"}>JPEG</MenuItem>
          <MenuItem value={"bmp"}>BMP</MenuItem>
        </TextField>
        <TextField
          label="Quality"
          value={imgQuality}
          onChange={(e) => setImgQuality(e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </Box>

      {imgFileSize !== "0 o" && <Typography>≈ {imgFileSize}</Typography>}

      <Button
        disabled={!imgDataURL || imgFileSize === "0 o"}
        onClick={download}
      >
        Download
      </Button>

      <canvas id="canvas" ref={canvasRef}></canvas>
    </StyledDownloadSection>
  );
}

export default DownloadSection;
