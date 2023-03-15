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
    data && (
      <>
        {data.sets.map((set, index) => (
          <path
            key={set.id}
            fill={set.color}
            d={describeArc(
              graphData.imageHeight / 2,
              graphData.imageHeight / 2,
              (graphData.imageHeight - graphData.axisMargin) / 2,
              getSlicePosition(set.groups[0].inputs[0], index).start,
              getSlicePosition(set.groups[0].inputs[0], index).end
            )}
          />
        ))}
        {data.sets.map((set, index) => (
          <g key={set.id}>
            <rect
              fill={set.color}
              x={graphData.imageHeight - graphData.textSize}
              y={
                graphData.axisMargin +
                graphData.textSize * index -
                graphData.textSize / 2
              }
              width={graphData.textSize / 2}
              height={graphData.textSize / 2}
            />
            <text
              x={graphData.imageHeight}
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
