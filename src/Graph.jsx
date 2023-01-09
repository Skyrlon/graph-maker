import styled from "styled-components";
import LinearGraph from "./LinearGraph";
import { useCallback, useEffect, useRef, useState } from "react";
import BarGraph from "./BarGraph";

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
  const axisLength = 1000;

  const axisMargin = axisLength * 0.3;

  const imageLength = 2 * axisMargin + axisLength;

  const axisStrokeWidth = axisLength / 100;

  const textSize = imageLength / 40;

  const graphColor = "black";

  const graphData = {
    axisLength,
    axisMargin,
    imageLength,
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
            viewBox={`0 0 ${imageLength} ${imageLength}`}
            width={imageLength}
            height={imageLength}
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
          </StyledSvg>
        )}
      </div>
    </StyledGraph>
  );
}

export default Graph;
