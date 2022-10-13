import { useEffect, useState } from "react";
import styled from "styled-components";
import { sortArrayOfObjects } from "./Helpers";

const StyledGraph = styled.div`
  grid-area: graph;
`;

function Graph({ data }) {
  const axisLength = 1000;

  const axisMargin = axisLength * 0.1;

  const imageLength = 2 * axisMargin + axisLength;

  const [axisAmplitudes, setAxisAmplitudes] = useState({});

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  useEffect(() => {
    const calculateAmplitude = (lowestValue, largestValue) => {
      let amplitude;
      if (largestValue <= 0) {
        amplitude = Math.abs(lowestValue);
      } else if (lowestValue >= 0) {
        amplitude = largestValue;
      } else if (lowestValue < 0 && largestValue > 0) {
        amplitude = Math.abs(lowestValue) + largestValue;
      }
      return (
        findOrderOfMagnitude(amplitude) *
        (Math.ceil((amplitude * 10) / findOrderOfMagnitude(amplitude)) / 10)
      );
    };

    const setAxis = () => {
      const sortedDataByY = sortArrayOfObjects(data, "y");
      setAxisAmplitudes({
        x: calculateAmplitude(data[0].x, data[data.length - 1].x),
        y: calculateAmplitude(
          sortedDataByY[0].y,
          sortedDataByY[sortedDataByY.length - 1].y
        ),
      });
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
          viewBox={`0 0 ${imageLength} ${imageLength}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="black"
            strokeWidth={10}
            d={`M ${axisMargin},${axisMargin} L ${axisMargin},${
              imageLength - axisMargin / 2
            } M ${axisMargin / 2},${axisMargin + axisLength} L ${
              axisMargin + axisLength
            },${axisMargin + axisLength}`}
          />
          <path
            fill="none"
            stroke="red"
            strokeWidth={5}
            d={`M ${data[0].x * (axisLength / axisAmplitudes.x) + axisMargin},${
              axisMargin +
              axisLength -
              data[0].y * (axisLength / axisAmplitudes.y)
            } ${data
              .map(
                (pos) =>
                  `L ${pos.x * (axisLength / axisAmplitudes.x) + axisMargin},${
                    axisMargin +
                    axisLength -
                    pos.y * (axisLength / axisAmplitudes.y)
                  }`
              )
              .join(" ")}`}
          />
        </svg>
      )}
      {axisAmplitudes.x} {axisAmplitudes.y}
    </StyledGraph>
  );
}

export default Graph;
