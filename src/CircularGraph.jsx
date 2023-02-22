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
    ].join(" ");

    return d;
  };

  const calculateAngle = (number, total) => {
    return (number * 360) / total;
  };

  return (
    data &&
    data.sets.map((set, index) => (
      <path
        key={set.id}
        fill="none"
        stroke={set.color}
        strokeWidth="20"
        d={describeArc(
          graphData.imageLength / 2,
          graphData.imageLength / 2,
          (graphData.imageLength - graphData.axisMargin) / 2,
          index > 0
            ? calculateAngle(
                Number(
                  data.sets
                    .slice(0, index)
                    .reduce(
                      (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                      0
                    )
                ) || 0,
                data.sets.reduce(
                  (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                  0
                )
              )
            : 0,
          (index > 0
            ? calculateAngle(
                Number(
                  data.sets
                    .slice(0, index)
                    .reduce(
                      (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                      0
                    )
                ) || 0,
                data.sets.reduce(
                  (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                  0
                )
              )
            : 0) +
            calculateAngle(
              Number(set.groups[0].inputs[0]),
              data.sets.reduce(
                (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                0
              )
            )
        )}
      />
    ))
  );
}
