export default function CircularGraph({ data, graphData }) {
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M",
      x,
      y,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
    ].join(" ");

    return d;
  };

  const getSlicePosition = (number, index) => {
    const previousSlices =
      index > 0
        ? Number(
            data.sets
              .slice(0, index)
              .reduce((a, b) => Number(a) + Number(b.groups[0].inputs[0]), 0)
          )
        : 0;
    const total = data.sets.reduce(
      (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
      0
    );
    return {
      start: calculateAngle(previousSlices, total),
      end: calculateAngle(previousSlices + Number(number), total),
    };
  };

  const calculateAngle = (number, total) => {
    return (number * (360 - 0.00001)) / total;
  };

  return (
    data &&
    data.sets.map((set, index) => (
      <g key={set.id}>
        <path
          fill={set.color}
          d={describeArc(
            graphData.imageLength / 2,
            graphData.imageLength / 2,
            (graphData.imageLength - graphData.axisMargin) / 2,
            getSlicePosition(set.groups[0].inputs[0], index).start,
            getSlicePosition(set.groups[0].inputs[0], index).end
          )}
        />
        <text
          x={graphData.imageLength / 2}
          y={graphData.imageLength / 4}
          fontSize={graphData.textSize}
          textAnchor="middle"
          fill="white"
          transform={`rotate(${
            getSlicePosition(set.groups[0].inputs[0], index).start +
            (getSlicePosition(set.groups[0].inputs[0], index).end -
              getSlicePosition(set.groups[0].inputs[0], index).start) /
              2
          } ${graphData.imageLength / 2} ${graphData.imageLength / 2}) `}
        >
          {set.name}
        </text>
      </g>
    ))
  );
}
