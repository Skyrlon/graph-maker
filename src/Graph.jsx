import styled from "styled-components";
import LinearGraph from "./LinearGraph";
import { useCallback, useEffect, useRef, useState } from "react";
import BarGraph from "./BarGraph";
import CircularGraph from "./CircularGraph";

const StyledGraph = styled.div`
  grid-area: graph;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & .container {
    width: 100%;
  }

  @media (max-width: 767px) {
    height: 33%;
    width: 100%;
  }
`;

const StyledSvg = styled.svg.attrs((props) => ({
  style: { width: props.svgSize, height: props.svgSize },
}))`
  position: relative;
`;

function Graph({ data, sendSvgData }) {
  const imageWidth = 2000;

  const imageHeight = (imageWidth * 3) / 4;

  const axisLength = imageHeight * 0.8;

  const axisMargin = (imageHeight - axisLength) / 2;

  const axisStrokeWidth = imageHeight / 100;

  const textSize = imageHeight / 30;

  const graphColor = "black";

  const graphData = {
    axisLength,
    axisMargin,
    imageWidth,
    imageHeight,
    axisStrokeWidth,
    textSize,
    graphColor,
  };

  const handleSvg = useCallback(
    (node) => {
      sendSvgData({
        width: graphData.imageLength,
        height: graphData.imageLength,
        node,
      });
    },
    // eslint-disable-next-line
    []
  );

  const [sectionWidth, setContainerWidth] = useState();
  const [sectionHeight, setContainerHeight] = useState();

  const sectionRef = useRef(null);

  useEffect(() => {
    resizeObserver.observe(sectionRef.current);
    return function cleanup() {
      resizeObserver.disconnect();
    };
  });

  const handleElementResized = () => {
    if (sectionRef.current.offsetWidth !== sectionWidth) {
      setContainerWidth(sectionRef.current.offsetWidth);
    }
    if (sectionRef.current.offsetHeight !== sectionHeight) {
      setContainerHeight(sectionRef.current.offsetHeight);
    }
  };

  const resizeObserver = new ResizeObserver(handleElementResized);

  return (
    <StyledGraph ref={sectionRef}>
      <div className="container">
        {data && (
          <StyledSvg
            svgSize={
              sectionWidth > sectionHeight ? sectionHeight : sectionWidth
            }
            viewBox={`0 0 ${imageWidth} ${imageHeight}`}
            width={imageWidth}
            height={imageHeight}
            xmlns="http://www.w3.org/2000/svg"
            ref={handleSvg}
          >
            {data.graphType === "linear" && (
              <LinearGraph
                data={data}
                sendSvgData={sendSvgData}
                graphData={graphData}
              />
            )}
            {data.graphType === "bar" && (
              <BarGraph
                data={data}
                sendSvgData={sendSvgData}
                graphData={graphData}
              />
            )}
            {data.graphType === "circular" && (
              <CircularGraph
                data={data}
                sendSvgData={sendSvgData}
                graphData={graphData}
              />
            )}
          </StyledSvg>
        )}
      </div>
    </StyledGraph>
  );
}

export default Graph;
