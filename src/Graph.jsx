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

  const [axis, setAxis] = useState(undefined);

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const getPosition = (number, amplitude, start) => {
    return (
      axisMargin + Math.abs(Number(number) - start) * (axisLength / amplitude)
    );
  };

  useEffect(() => {
    const calculateAmplitude = (lowestValue, largestValue) => {
      let difference, start;

      if (largestValue <= 0) {
        difference = Math.abs(lowestValue);
        start = lowestValue;
      } else if (lowestValue >= 0) {
        difference = largestValue;
        start = 0;
      } else if (lowestValue < 0 && largestValue > 0) {
        difference = Math.abs(Number(lowestValue)) + Number(largestValue);
        start = lowestValue;
      }

      return {
        amplitude:
          findOrderOfMagnitude(difference) *
          (Math.ceil((difference * 10) / findOrderOfMagnitude(difference)) /
            10),
        start,
      };
    };

    const setAxisData = () => {
      const sortedDataByY = sortArrayOfObjects(data, "y");
      setAxis({
        x: calculateAmplitude(data[0].x, data[data.length - 1].x),
        y: calculateAmplitude(
          sortedDataByY[0].y,
          sortedDataByY[sortedDataByY.length - 1].y
        ),
      });
    };

    if (data) {
      setAxisData();
    }
  }, [data]);

  return (
    <StyledGraph>
      {data && axis && (
        <>
          <svg
            width="50%"
            viewBox={`0 0 ${imageLength} ${imageLength}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="black"
              strokeWidth={10}
              d={`M ${axisMargin / 2},${getPosition(
                0,
                axis.y.amplitude,
                sortArrayOfObjects(data, "y")[
                  sortArrayOfObjects(data, "y").length - 1
                ].y
              )} 
          L ${axisMargin + axisLength},${getPosition(
                0,
                axis.y.amplitude,
                sortArrayOfObjects(data, "y")[
                  sortArrayOfObjects(data, "y").length - 1
                ].y
              )}`}
            />
            <path
              fill="none"
              stroke="black"
              strokeWidth={10}
              d={`M ${getPosition(
                0,
                axis.x.amplitude,
                axis.x.start
              )},${axisMargin} 
              L ${getPosition(0, axis.x.amplitude, axis.x.start)},${
                imageLength - axisMargin / 2
              } 
              `}
            />
            <path
              fill="none"
              stroke="red"
              strokeWidth={5}
              d={`M ${getPosition(
                data[0].x,
                axis.x.amplitude,
                axis.x.start
              )},${getPosition(
                data[0].y,
                axis.y.amplitude,
                sortArrayOfObjects(data, "y")[
                  sortArrayOfObjects(data, "y").length - 1
                ].y
              )} ${data
                .map(
                  (pos) =>
                    `L ${getPosition(
                      pos.x,
                      axis.x.amplitude,
                      axis.x.start
                    )},${getPosition(
                      pos.y,
                      axis.y.amplitude,
                      sortArrayOfObjects(data, "y")[
                        sortArrayOfObjects(data, "y").length - 1
                      ].y
                    )}`
                )
                .join(" ")}`}
            />
          </svg>
          {axis.x.amplitude} {axis.y.amplitude}
        </>
      )}
    </StyledGraph>
  );
}

export default Graph;
