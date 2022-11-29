import styled from "styled-components";
import LinearGraph from "./LinearGraph";

const StyledGraph = styled.div`
  grid-area: graph;
`;

function Graph({ data, sendSvgData }) {
  return (
    <StyledGraph>
      {data.graphType === "linear" && (
        <LinearGraph data={data} sendSvgData={sendSvgData} />
      )}
    </StyledGraph>
  );
}

export default Graph;
