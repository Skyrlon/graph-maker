import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { sortArrayOfObjects } from "./Helpers";

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
      Math.abs(Number(number) - referenceValue) *
        (axisLength / axis.x.amplitude)
    );
  };

  const getPositionY = (number) => {
    const largestY = getLargestValues("second")[0];
    const referenceValue = largestY > 0 ? largestY : 0;
    return (
      axisMargin +
      Math.abs(Number(number) - referenceValue) *
        (axisLength / axis.y.amplitude)
    );
  };

  useEffect(
    () => {
      const calculateAmplitude = (lowestValue, largestValue) => {
        let difference, start;

        if (largestValue <= 0) {
          difference = Math.abs(lowestValue);
          start = Math.ceil(lowestValue);
        } else if (lowestValue >= 0) {
          difference = largestValue;
          start = 0;
        } else if (lowestValue < 0 && largestValue > 0) {
          difference = Math.abs(Number(lowestValue)) + Number(largestValue);
          start = Math.ceil(lowestValue);
        }

        const values = Array.from({
          length:
            Math.ceil((difference * 10) / findOrderOfMagnitude(difference)) /
              10 +
            1,
        }).map((v, i) => {
          return start + findOrderOfMagnitude(difference) * i;
        });

        return {
          amplitude:
            findOrderOfMagnitude(difference) *
            (Math.ceil((difference * 10) / findOrderOfMagnitude(difference)) /
              10),
          values,
        };
      };

      const setAxisData = () => {
        setAxis({
          x: calculateAmplitude(
            getLowestValues("first")[0],
            getLargestValues("first")[0]
          ),
          y: calculateAmplitude(
            getLowestValues("second")[0],
            getLargestValues("second")[0]
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

  const handleSvg = useCallback(
    (node) => {
      sendSvgData({ width: imageLength, height: imageLength, node });
    },
    // eslint-disable-next-line
    []
  );

  return (
    <StyledGraph>
      {data && axis && (
        <div className="container">
          <svg
            viewBox={`0 0 ${imageLength} ${imageLength}`}
            width={imageLength}
            height={imageLength}
            xmlns="http://www.w3.org/2000/svg"
            ref={handleSvg}
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
                <path d="M0,0 V4 L2,2 Z" fill={graphColor} />
              </marker>
            </defs>

            <path
              markerStart="url(#arrow-head)"
              markerEnd="url(#arrow-head)"
              fill="none"
              stroke={graphColor}
              strokeWidth={axisStrokeWidth}
              d={`M ${axisMargin / 2},${getPositionY(0)} 
                  L ${axisMargin * 1.5 + axisLength},${getPositionY(0)}`}
            />
            <path
              markerStart="url(#arrow-head)"
              markerEnd="url(#arrow-head)"
              fill="none"
              stroke={graphColor}
              strokeWidth={axisStrokeWidth}
              d={`M ${getPositionX(0)},${axisMargin / 2} 
                  L ${getPositionX(0)},${imageLength - axisMargin / 2} 
              `}
            />

            {axis.x.values.map(
              (v) =>
                v !== 0 && (
                  <g
                    key={v}
                    transform={`translate(${getPositionX(v)}, ${getPositionY(
                      0
                    )})`}
                  >
                    <rect
                      fill={graphColor}
                      x={-textSize / 8}
                      y={-textSize / 2}
                      width={textSize / 4}
                      height={textSize}
                    />
                    <text
                      x={0}
                      y={textSize * 2}
                      fontSize={textSize}
                      textAnchor="middle"
                      color={graphColor}
                    >
                      {v}
                    </text>
                  </g>
                )
            )}

            {axis.y.values.map(
              (v) =>
                v !== 0 && (
                  <g
                    key={v}
                    transform={`translate(${getPositionX(0)}, ${getPositionY(
                      v
                    )})`}
                  >
                    <rect
                      fill={graphColor}
                      x={-textSize / 2}
                      y={-textSize / 8}
                      width={textSize}
                      height={textSize / 4}
                    />
                    <text
                      x={-textSize}
                      y={textSize / 3}
                      fontSize={textSize}
                      textAnchor="middle"
                    >
                      {v}
                    </text>
                  </g>
                )
            )}

            {data.sets.map((set) => (
              <path
                key={set.id}
                fill="none"
                stroke={set.color}
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

            {data.sets.map((set) =>
              set.dots.map((dot) => (
                <circle
                  key={dot.id}
                  cx={getPositionX(dot.first)}
                  cy={getPositionY(dot.second)}
                  r={axisStrokeWidth}
                  fill={graphColor}
                />
              ))
            )}

            <text
              x={imageLength - axisMargin / 2}
              y={axisMargin / 3 + getPositionY(0)}
              style={{ fontSize: textSize }}
              color={graphColor}
            >
              {data.axis.first}
            </text>
            <text
              textAnchor="middle"
              x={getPositionX(0)}
              y={axisMargin / 3}
              fontSize={textSize}
              color={graphColor}
            >
              {data.axis.second}
            </text>
            <text
              textAnchor="middle"
              x={imageLength / 2}
              y={imageLength - axisMargin / 4}
              fontSize={textSize}
              color={graphColor}
            >
              {data.title}
            </text>
            {data.sets.length > 1 &&
              data.sets.map((set, index) => (
                <g key={set.id}>
                  <rect
                    fill={set.color}
                    x={imageLength - axisMargin / 2 - textSize}
                    y={axisMargin + textSize * index - textSize / 2}
                    width={textSize / 2}
                    height={textSize / 2}
                  />
                  <text
                    x={imageLength - axisMargin / 2}
                    y={axisMargin + textSize * index}
                    fontSize={textSize}
                    color={graphColor}
                  >
                    {set.name}
                  </text>
                </g>
              ))}
          </svg>
        </div>
      )}
    </StyledGraph>
  );
}

export default Graph;
