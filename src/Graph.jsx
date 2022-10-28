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

  const axisStrokeWidth = axisLength / 100;

  const textSize = imageLength / 40;

  const [axis, setAxis] = useState(undefined);

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const getLowestValues = (key) => {
    let lowestValueOfEachSet = [];
    data.sets.forEach((set) => {
      lowestValueOfEachSet.push(sortArrayOfObjects(set.dots, key)[0][key]);
    });
    lowestValueOfEachSet.sort((a, b) => Number(a) - Number(b));
    return lowestValueOfEachSet;
  };

  const getLargestValues = (key) => {
    let largestValueOfEachSet = [];
    data.sets.forEach((set) =>
      largestValueOfEachSet.push(
        sortArrayOfObjects(set.dots, key)[
          sortArrayOfObjects(set.dots, key).length - 1
        ][key]
      )
    );
    largestValueOfEachSet.sort((a, b) => Number(b) - Number(a));
    return largestValueOfEachSet;
  };

  const getPositionX = (number) => {
    const lowestValue = getLowestValues("first")[0];
    const referenceValue = lowestValue < 0 ? lowestValue : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) * (axisLength / axis.x)
    );
  };

  const getPositionY = (number) => {
    const largestY = getLargestValues("second")[0];
    const referenceValue = largestY > 0 ? largestY : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) * (axisLength / axis.y)
    );
  };

  useEffect(
    () => {
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
        setAxis({
          x: calculateAmplitude(
            getLowestValues("first"),
            getLargestValues("first")
          ),
          y: calculateAmplitude(
            getLowestValues("second"),
            getLargestValues("second")
          ),
        });
      };

      if (data) {
        setAxisData();
      }
    },
    // eslint-disable-next-line
    [data]
  );

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
                markerWidth={axisStrokeWidth}
                markerHeight={axisStrokeWidth}
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
              strokeWidth={axisStrokeWidth}
              d={`M ${axisMargin / 2},${getPositionY(0)} 
                  L ${axisMargin * 1.5 + axisLength},${getPositionY(0)}`}
            />
            <path
              markerStart="url(#arrow-head)"
              markerEnd="url(#arrow-head)"
              fill="none"
              stroke="black"
              strokeWidth={axisStrokeWidth}
              d={`M ${getPositionX(0)},${axisMargin / 2} 
                  L ${getPositionX(0)},${imageLength - axisMargin / 2} 
              `}
            />
            {data.sets.map((set) => (
              <path
                key={set.id}
                fill="none"
                stroke="red"
                strokeWidth={axisStrokeWidth / 2}
                d={`M ${getPositionX(set.dots[0].first)},${getPositionY(
                  set.dots[0].second
                )}
              ${set.dots
                .map(
                  (dot) =>
                    `L ${getPositionX(dot.first)},${getPositionY(dot.second)}`
                )
                .join(" ")}`}
              />
            ))}

            <>
              {data.sets.map((set) =>
                set.dots.map((dot) => (
                  <circle
                    key={dot.id}
                    cx={getPositionX(dot.first)}
                    cy={getPositionY(dot.second)}
                    r={axisStrokeWidth}
                  />
                ))
              )}
            </>

            <text
              x={imageLength - axisMargin / 2}
              y={axisMargin / 3 + getPositionY(0)}
              style={{ fontSize: textSize }}
            >
              {data.axis.first}
            </text>
            <text
              textAnchor="middle"
              x={getPositionX(0)}
              y={axisMargin / 3}
              style={{
                fontSize: textSize,
              }}
            >
              {data.axis.second}
            </text>
            <text
              textAnchor="middle"
              x={imageLength / 2}
              y={imageLength - axisMargin / 4}
              style={{
                fontSize: textSize,
              }}
            >
              {data.title}
            </text>
          </svg>
          {axis.x} {axis.y}
        </>
      )}
    </StyledGraph>
  );
}

export default Graph;
