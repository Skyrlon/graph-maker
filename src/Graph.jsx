import { useEffect, useState } from "react";
import styled from "styled-components";
import { sortArrayOfObjects } from "./Helpers";

const StyledGraph = styled.div`
  grid-area: graph;
`;

function Graph({ data }) {
  const findLargestY = (array) => {
    const sortedArray = sortArrayOfObjects(array, "y");
    return sortedArray[sortedArray.length - 1].y;
  };

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const [xAxisAmplitude, setXAxisAmplitude] = useState();

  const [yAxisAmplitude, setYAxisAmplitude] = useState();

  useEffect(() => {
    const calculateAmplitude = (largestValue) => {
      return (
        findOrderOfMagnitude(largestValue) *
        Math.ceil(largestValue / findOrderOfMagnitude(largestValue))
      );
    };

    const setAxis = () => {
      setXAxisAmplitude(calculateAmplitude(data[data.length - 1].x));
      setYAxisAmplitude(calculateAmplitude(findLargestY(data)));
    };

    if (data) {
      setAxis();
    }
  }, [data]);

  return (
    <StyledGraph>
      {data && (
        <svg
          width="50%"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="black"
            strokeWidth={10}
            d="M 100,100 L 100,1150 M 50,1100 L 1100,1100"
          />
          <path
            fill="none"
            stroke="red"
            strokeWidth={5}
            d={`M ${data[0].x * (1000 / xAxisAmplitude) + 100},${
              1100 - data[0].y * (1000 / yAxisAmplitude)
            } ${data
              .map(
                (pos) =>
                  `L ${pos.x * (1000 / xAxisAmplitude) + 100},${
                    1100 - pos.y * (1000 / yAxisAmplitude)
                  }`
              )
              .join(" ")}`}
          />
        </svg>
      )}
      {xAxisAmplitude} {yAxisAmplitude}
    </StyledGraph>
  );
}

export default Graph;
