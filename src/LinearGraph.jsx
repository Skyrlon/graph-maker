import { useEffect, useState } from "react";

export default function LinearGraph({ data, graphData }) {
  const [axis, setAxis] = useState(undefined);

  const findOrderOfMagnitude = (number) => {
    return Math.pow(10, Math.ceil(number).toString().length - 1);
  };

  const getLowestValues = (index) => {
    let lowestValueOfEachSet = [];
    data.sets.forEach((set) => {
      lowestValueOfEachSet.push(
        [...set.groups].sort(
          (a, b) => Number(a.inputs[index]) - Number(b.inputs[index])
        )[0].inputs[index]
      );
    });
    lowestValueOfEachSet.sort((a, b) => Number(a) - Number(b));
    return lowestValueOfEachSet;
  };

  const getLargestValues = (index) => {
    let largestValueOfEachSet = [];
    data.sets.forEach((set) => {
      largestValueOfEachSet.push(
        [...set.groups].sort(
          (a, b) => Number(b.inputs[index]) - Number(a.inputs[index])
        )[0].inputs[index]
      );
    });
    largestValueOfEachSet.sort((a, b) => Number(b) - Number(a));
    return largestValueOfEachSet;
  };

  const getPositionX = (number) => {
    const lowestValue = getLowestValues(0)[0];
    const referenceValue = lowestValue < 0 ? lowestValue : 0;
    return (
      graphData.axisMargin +
      Math.abs(Number(number) - referenceValue) *
        (graphData.axisLength / axis.x.amplitude)
    );
  };

  const getPositionY = (number) => {
    const largestY = getLargestValues(1)[0];
    const referenceValue = largestY > 0 ? largestY : 0;
    return (
      graphData.axisMargin +
      Math.abs(Number(number) - referenceValue) *
        (graphData.axisLength / axis.y.amplitude)
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
          x: calculateAmplitude(getLowestValues(0)[0], getLargestValues(0)[0]),
          y: calculateAmplitude(getLowestValues(1)[0], getLargestValues(1)[0]),
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
                  L ${
                    graphData.axisMargin * 1.5 + graphData.axisLength
                  },${getPositionY(0)}`}
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

        {axis.x.values.map(
          (v) =>
            v !== 0 && (
              <g
                key={v}
                transform={`translate(${getPositionX(v)}, ${getPositionY(0)})`}
              >
                <rect
                  fill={graphData.graphColor}
                  x={-graphData.textSize / 8}
                  y={-graphData.textSize / 2}
                  width={graphData.textSize / 4}
                  height={graphData.textSize}
                />
                <text
                  x={0}
                  y={graphData.textSize * 2}
                  fontSize={graphData.textSize}
                  textAnchor="middle"
                  color={graphData.graphColor}
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

        {data.sets.map((set) => (
          <path
            key={set.id}
            fill="none"
            stroke={set.color}
            strokeWidth={graphData.axisStrokeWidth / 2}
            d={`M ${getPositionX(set.groups[0].inputs[0])},${getPositionY(
              set.groups[0].inputs[1]
            )}
              ${set.groups
                .map(
                  (group) =>
                    `L ${getPositionX(group.inputs[0])},${getPositionY(
                      group.inputs[1]
                    )}`
                )
                .join(" ")}`}
          />
        ))}

        {data.sets.map((set) =>
          set.groups.map((group) => (
            <circle
              key={group.id}
              cx={getPositionX(group.inputs[0])}
              cy={getPositionY(group.inputs[1])}
              r={graphData.axisStrokeWidth}
              fill={graphData.graphColor}
            />
          ))
        )}

        <text
          x={graphData.imageLength - graphData.axisMargin / 2}
          y={graphData.axisMargin / 3 + getPositionY(0)}
          style={{ fontSize: graphData.textSize }}
          color={graphData.graphColor}
        >
          {data.axis.first}
        </text>
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
        {data.sets.length > 1 &&
          data.sets.map((set, index) => (
            <g key={set.id}>
              <rect
                fill={set.color}
                x={
                  graphData.imageLength -
                  graphData.axisMargin / 2 -
                  graphData.textSize
                }
                y={
                  graphData.axisMargin +
                  graphData.textSize * index -
                  graphData.textSize / 2
                }
                width={graphData.textSize / 2}
                height={graphData.textSize / 2}
              />
              <text
                x={graphData.imageLength - graphData.axisMargin / 2}
                y={graphData.axisMargin + graphData.textSize * index}
                fontSize={graphData.textSize}
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
