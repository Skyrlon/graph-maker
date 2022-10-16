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

  const getPositionX = (number) => {
    const lowestValue = data[0].x;
    const referenceValue = lowestValue < 0 ? lowestValue : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) * (axisLength / axis.x)
    );
  };

  const getPositionY = (number) => {
    const largestY = Number(
      sortArrayOfObjects(data, "y")[sortArrayOfObjects(data, "y").length - 1].y
    );
    const referenceValue = largestY > 0 ? largestY : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) * (axisLength / axis.y)
    );
  };

  useEffect(() => {
    const calculateAmplitude = (lowestValue, largestValue) => {
      let difference;

      if (largestValue <= 0) {
        difference = Math.abs(lowestValue);
      } else if (lowestValue >= 0) {
        difference = largestValue;
      } else if (lowestValue < 0 && largestValue > 0) {
        difference = Math.abs(Number(lowestValue)) + Number(largestValue);
      }

      return (
        findOrderOfMagnitude(difference) *
        (Math.ceil((difference * 10) / findOrderOfMagnitude(difference)) / 10)
      );
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
              d={`M ${axisMargin / 2},${getPositionY(0)} 
                  L ${axisMargin + axisLength},${getPositionY(0)}`}
            />
            <path
              fill="none"
              stroke="black"
              strokeWidth={10}
              d={`M ${getPositionX(0)},${axisMargin} 
                  L ${getPositionX(0)},${imageLength - axisMargin / 2} 
              `}
            />
            <path
              fill="none"
              stroke="red"
              strokeWidth={5}
              d={`M ${getPositionX(data[0].x)},${getPositionY(data[0].y)} 
                  ${data
                    .map(
                      (pos) => `L ${getPositionX(pos.x)},${getPositionY(pos.y)}`
                    )
                    .join(" ")}`}
            />
          </svg>
          {axis.x} {axis.y}
        </>
      )}
    </StyledGraph>
  );
}

export default Graph;
