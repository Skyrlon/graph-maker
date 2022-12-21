import styled from "styled-components";
import LinearGraph from "./LinearGraph";
import { useCallback } from "react";
import BarGraph from "./BarGraph";

const StyledGraph = styled.div`
  grid-area: graph;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .container {
    width: 50%;
  }
  svg {
    position: relative;
    width: 100%;
    height: 100%;
  }
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

  return (
    <StyledGraph>
      <div className="container">
        {data && (
          <svg
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
          </svg>
        )}
      </div>
    </StyledGraph>
  );
}

export default Graph;
