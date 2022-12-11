import { useEffect, useState } from "react";

export default function BarGraph({ data, sendData, graphData }) {
  const [axis, setAxis] = useState(undefined);

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const getPositionX = (number) => {
    const lowestValue = 0;
    const referenceValue = lowestValue < 0 ? lowestValue : 0;
    return (
      graphData.axisMargin +
      Math.abs(Number(number) - referenceValue) *
        (graphData.axisLength / axis.x.amplitude)
    );
  };

  const getPositionY = (number) => {
    const largestY = getLargestStackedValue();
    const referenceValue = largestY > 0 ? largestY : 0;
    return (
      graphData.axisMargin +
      Math.abs(Number(number) - referenceValue) *
        (graphData.axisLength / axis.y.amplitude)
    );
  };

  const getLargestStackedValue = () => {
    let stackedValues = [];
    data.sets.forEach((set) => {
      stackedValues.push(
        set.groups.reduce(
          (accumulator, currentGroup) =>
            Number(accumulator) + Number(currentGroup.inputs[0]),
          0
        )
      );
    });
    stackedValues.sort((a, b) => Number(b) - Number(a));
    return stackedValues[0];
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
          x: calculateAmplitude(0, data.sets.length + 1),
          y: calculateAmplitude(0, getLargestStackedValue()),
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
    data &&
    axis && (
      <>
        <defs>
          <marker
            id="arrow-head"
            orient="auto-start-reverse"
            markerWidth={graphData.axisStrokeWidth}
            markerHeight={graphData.axisStrokeWidth}
            refX="0.1"
            refY="2"
          >
            <path d="M0,0 V4 L2,2 Z" fill={graphData.graphColor} />
          </marker>
        </defs>

        <path
          markerStart="url(#arrow-head)"
          markerEnd="url(#arrow-head)"
          fill="none"
          stroke={graphData.graphColor}
          strokeWidth={graphData.axisStrokeWidth}
          d={`M ${graphData.axisMargin / 2},${getPositionY(0)} 
          L ${graphData.axisMargin * 1.5 + graphData.axisLength},${getPositionY(
            0
          )}`}
        />
        <path
          markerStart="url(#arrow-head)"
          markerEnd="url(#arrow-head)"
          fill="none"
          stroke={graphData.graphColor}
          strokeWidth={graphData.axisStrokeWidth}
          d={`M ${getPositionX(0)},${graphData.axisMargin / 2} 
          L ${getPositionX(0)},${
            graphData.imageLength - graphData.axisMargin / 2
          } 
      `}
        />
        {axis.y.values.map(
          (v) =>
            v !== 0 && (
              <g
                key={v}
                transform={`translate(${getPositionX(0)}, ${getPositionY(v)})`}
              >
                <rect
                  fill={graphData.graphColor}
                  x={-graphData.textSize / 2}
                  y={-graphData.textSize / 8}
                  width={graphData.textSize}
                  height={graphData.textSize / 4}
                />
                <text
                  x={-graphData.textSize}
                  y={graphData.textSize / 3}
                  fontSize={graphData.textSize}
                  textAnchor="middle"
                >
                  {v}
                </text>
              </g>
            )
        )}
        <text
          textAnchor="middle"
          x={getPositionX(0)}
          y={graphData.axisMargin / 3}
          fontSize={graphData.textSize}
          color={graphData.graphColor}
        >
          {data.axis.second}
        </text>
        <text
          textAnchor="middle"
          x={graphData.imageLength / 2}
          y={graphData.imageLength - graphData.axisMargin / 4}
          fontSize={graphData.textSize}
          color={graphData.graphColor}
        >
          {data.title}
        </text>

        {data.sets.map((set, index) => (
          <g
            key={set.id}
            transform={`translate(${
              getPositionX(index + 1) - (graphData.axisStrokeWidth * 5) / 2
            }, 0)`}
          >
            {set.groups.map((group, index, array) => (
              <rect
                key={group.id}
                x={0}
                y={
                  index === 0
                    ? getPositionY(group.inputs[0])
                    : getPositionY(
                        Number(group.inputs[0]) +
                          Number(array[index - 1].inputs[0])
                      )
                }
                width={graphData.axisStrokeWidth * 5}
                height={
                  graphData.imageLength -
                  getPositionY(group.inputs[0]) -
                  graphData.axisMargin -
                  graphData.axisStrokeWidth / 2
                }
                fill={set.color}
              />
            ))}
          </g>
        ))}

        {data.sets.map((set, index) => (
          <g
            key={set.id}
            transform={`translate(${getPositionX(index + 1)}, ${getPositionY(
              0
            )})`}
          >
            <rect
              fill={graphData.graphColor}
              x={-graphData.textSize / 8}
              y={0}
              width={graphData.textSize / 4}
              height={graphData.textSize / 2}
            />
            <text
              x={0}
              y={graphData.textSize * 2}
              fontSize={graphData.textSize}
              textAnchor="middle"
              color={graphData.graphColor}
            >
              {set.name}
            </text>
          </g>
        ))}
      </>
    )
  );
}
