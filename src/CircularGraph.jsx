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

  const getTextPosition = (x, y, radius, startAngle, endAngle) => {
    let posX, posY;
    const angle = (endAngle - startAngle) / 2 + startAngle;
    const position = polarToCartesian(x, y, radius, angle);
    if (endAngle - startAngle > (8 / 100) * 360) {
      posX = position.x;
      posY = position.y;
    } else {
      const start = polarToCartesian(x, y, radius * 2, endAngle);
      const end = polarToCartesian(x, y, radius * 2, startAngle);
      posX = (end.x - start.x) / 2 + start.x;
      posY = end.y - graphData.textSize;
    }
    return { x: posX, y: posY };
  };

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  function setContrast(rgb) {
    const brightness = Math.round(
      (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    );
    return brightness > 125 ? "black" : "white";
  }

  return (
    data && (
      <>
        {data.sets.map((set, index) => (
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
              x={
                getTextPosition(
                  graphData.imageLength / 2,
                  graphData.imageLength / 2,
                  (graphData.imageLength - graphData.axisMargin) / 4,
                  getSlicePosition(set.groups[0].inputs[0], index).start,
                  getSlicePosition(set.groups[0].inputs[0], index).end
                ).x
              }
              y={
                getTextPosition(
                  graphData.imageLength / 2,
                  graphData.imageLength / 2,
                  (graphData.imageLength - graphData.axisMargin) / 4,
                  getSlicePosition(set.groups[0].inputs[0], index).start,
                  getSlicePosition(set.groups[0].inputs[0], index).end
                ).y
              }
              fontSize={graphData.textSize}
              textAnchor="middle"
              fill={
                Number(set.groups[0].inputs[0]) >
                (8 / 100) *
                  data.sets.reduce(
                    (a, b) => Number(a) + Number(b.groups[0].inputs[0]),
                    0
                  )
                  ? setContrast(hexToRgb(set.color))
                  : "black"
              }
            >
              {set.name}
            </text>
          </g>
        ))}
      </>
    )
  );
}
