import { Button } from "@mui/material";
import styled from "styled-components";
import { useRef } from "react";

const StyledDownloadSection = styled.section`
  grid-area: save;
  border: 1px solid;
  #canvas {
    width: 500px;
    height: 500px;
  }
`;

function DownloadSection({ svgData }) {
  const canvasRef = useRef();

  function drawInlineSVG() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const svgText = svgData.outerHTML;
    var svg = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      domURL = window.URL || window.webkitURL || window,
      url = domURL.createObjectURL(svg),
      img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      domURL.revokeObjectURL(url);
    };

    img.src = url;
    let jpeg = canvas.toDataURL("image/jpeg");
    download(jpeg, "image.jpeg", canvas);
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
      <Button onClick={drawInlineSVG}>Download</Button>
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{ border: "1px solid red" }}
        width="1600"
        height="1600"
      ></canvas>
    </StyledDownloadSection>
  );
}

export default DownloadSection;
