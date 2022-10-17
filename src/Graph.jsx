import { useEffect, useState } from "react";
import styled from "styled-components";
import { sortArrayOfObjects } from "./Helpers";

const StyledGraph = styled.div`
  grid-area: graph;
`;

function Graph({ data }) {
  const axisLength = 1000;

  const axisMargin = axisLength * 0.2;

  const imageLength = 2 * axisMargin + axisLength;

  const [axis, setAxis] = useState(undefined);

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const getPositionX = (number) => {
    const lowestValue = data.values[0].firstInputValue;
    const referenceValue = lowestValue < 0 ? lowestValue : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) * (axisLength / axis.x)
    );
  };

  const getPositionY = (number) => {
    const largestY = Number(
      sortArrayOfObjects(data.values, "secondInputValue")[
        sortArrayOfObjects(data.values, "secondInputValue").length - 1
      ].secondInputValue
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
      const sortedDataByY = sortArrayOfObjects(data.values, "secondInputValue");
      setAxis({
        x: calculateAmplitude(
          data.values[0].firstInputValue,
          data.values[data.values.length - 1].firstInputValue
        ),
        y: calculateAmplitude(
          sortedDataByY[0].secondInputValue,
          sortedDataByY[sortedDataByY.length - 1].secondInputValue
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
            <defs>
              <marker
                id="arrow-head"
                orient="auto-start-reverse"
                markerWidth={10}
                markerHeight={10}
                refX="0.1"
                refY="2"
              >
                <path d="M0,0 V4 L2,2 Z" fill="black" />
              </marker>
            </defs>

            <path
              markerStart="url(#arrow-head)"
              markerEnd="url(#arrow-head)"
              fill="none"
              stroke="black"
              strokeWidth={10}
              d={`M ${axisMargin / 2},${getPositionY(0)} 
                  L ${axisMargin * 1.5 + axisLength},${getPositionY(0)}`}
            />
            <path
              markerStart="url(#arrow-head)"
              markerEnd="url(#arrow-head)"
              fill="none"
              stroke="black"
              strokeWidth={10}
              d={`M ${getPositionX(0)},${axisMargin / 2} 
                  L ${getPositionX(0)},${imageLength - axisMargin / 2} 
              `}
            />
            <path
              fill="none"
              stroke="red"
              strokeWidth={5}
              d={`M ${getPositionX(
                data.values[0].firstInputValue
              )},${getPositionY(data.values[0].secondInputValue)}
              ${data.values
                .map(
                  (pos) =>
                    `L ${getPositionX(pos.firstInputValue)},${getPositionY(
                      pos.secondInputValue
                    )}`
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
