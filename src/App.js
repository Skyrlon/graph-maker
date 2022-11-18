import "./App.css";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import DataInputs from "./DataInputs";
import styled from "styled-components";
import { useState } from "react";
import Graph from "./Graph";
import { sortArrayOfObjects } from "./Helpers";
import DownloadSection from "./DownloadSection";

const StyledBox = styled(Box)`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 60fr 11fr;
  gap: 0px 0px;
  grid-template-areas:
    "graph data-inputs"
    "save data-inputs";
`;

function App() {
  const [data, setData] = useState();
  const [svgData, setSvgData] = useState();

  const handleDataSubmitted = (dataSubmitted) => {
    setData({
      ...dataSubmitted,
      sets: dataSubmitted.sets.map((set) => {
        return { ...set, inputs: sortArrayOfObjects(set.inputs, "first") };
      }),
    });
  };

  return (
    <div className="App">
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            Graph Maker
          </Typography>
        </Toolbar>
      </AppBar>
      <StyledBox>
        <DataInputs dataSubmit={handleDataSubmitted} />
        {data && (
          <>
            <Graph data={data} sendSvgData={(x) => setSvgData(x)} />

            <DownloadSection svgData={{ ...svgData, title: data.title }} />
          </>
        )}
      </StyledBox>
    </div>
  );
}

export default App;
