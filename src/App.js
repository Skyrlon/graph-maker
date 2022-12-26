import "./App.css";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import DataInputs from "./DataInputs";
import styled from "styled-components";
import { useState } from "react";
import Graph from "./Graph";
import DownloadSection from "./DownloadSection";

const StyledApp = styled.div`
  @media screen and (max-width: 767px) {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const StyledBox = styled(Box)`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 60fr 11fr;
  gap: 0px 0px;
  grid-template-areas:
    "graph data-inputs"
    "save data-inputs";

  @media (max-width: 767px) {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

function App() {
  const [data, setData] = useState();
  const [svgData, setSvgData] = useState();

  const handleDataSubmitted = (dataSubmitted) => {
    setData({
      ...dataSubmitted,
    });
  };

  return (
    <StyledApp className="App">
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            Graph Maker
          </Typography>
        </Toolbar>
      </AppBar>
      <StyledBox>
        <DataInputs dataSubmit={handleDataSubmitted} />
        <Graph data={data} sendSvgData={(x) => setSvgData(x)} />
        <DownloadSection svgData={{ ...svgData, title: data?.title }} />
      </StyledBox>
    </StyledApp>
  );
}

export default App;
