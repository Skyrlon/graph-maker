import styled from "styled-components";

const StyledDownloadSection = styled.section`
  grid-area: save;
`;

function DownloadSection({ svgData }) {
  return (
    <StyledDownloadSection>
      {svgData?.outerHTML && svgData?.outerHTML}
    </StyledDownloadSection>
  );
}

export default DownloadSection;
