import styled from "styled-components";

const StyledGraph = styled.div`
  grid-area: graph;
`;

function Graph({ data }) {
  const findLargestY = (array) => {
    const sortedArray = [...array];
    sortedArray.sort((a, b) => a.y - b.y);
    return sortedArray[sortedArray.length - 1].y;
  };

  const xAxisLength =
    data &&
    Math.pow(10, Math.ceil(data[data.length - 1].x).toString().length - 1) *
      Math.ceil(data[data.length - 1].x);

  const yAxisLength =
    data &&
    Math.pow(10, Math.ceil(findLargestY(data)).toString().length - 1) *
      Math.ceil(findLargestY(data));

  return (
    <StyledGraph>
      {data && (
        <svg
          width="50%"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke="black"
            strokeWidth={10}
            d="M 100,100 L 100,1150 M 50,1100 L 1100,1100"
          />
          <path
            fill="none"
            stroke="red"
            strokeWidth={5}
            d={`M ${(data[0].x * 1000) / xAxisLength + 100},${
              1100 - (data[0].y * 1000) / yAxisLength
            } ${data
              .map(
                (pos) =>
                  `L ${(pos.x * 1000) / xAxisLength + 100},${
                    1100 - (pos.y * 1000) / yAxisLength
                  }`
              )
              .join(" ")}`}
          />
        </svg>
      )}
    </StyledGraph>
  );
}

export default Graph;