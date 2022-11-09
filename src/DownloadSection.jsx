import { Button } from "@mui/material";
import { useRef } from "react";
import styled from "styled-components";

const StyledDownloadSection = styled.section`
  grid-area: save;
`;

function DownloadSection({ svgData }) {
  var canvas = useRef();

  function triggerDownload(imgURI) {
    const evt = new MouseEvent("click", {
      view: window,
      bubbles: false,
      cancelable: true,
    });

    const a = document.createElement("a");
    a.setAttribute("download", "MY_COOL_IMAGE.png");
    a.setAttribute("href", imgURI);
    a.setAttribute("target", "_blank");
    a.dispatchEvent(evt);
  }

  function handleDownloadClick() {
    let ctx = canvas.current.getContext("2d");
    let data = new XMLSerializer().serializeToString(svgData);
    let DOMURL = window.URL || window.webkitURL || window;

    let img = new Image();
    let svgBlob = new Blob([data], {
      type: "image/svg+xml;charset=utf-8",
    });
    let url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);

      let imgURI = canvas.current
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      triggerDownload(imgURI);
    };

    img.src = url;
  }

  return (
    <StyledDownloadSection>
      <Button onClick={handleDownloadClick}>Download</Button>
      <canvas ref={canvas}></canvas>
    </StyledDownloadSection>
  );
}

export default DownloadSection;
