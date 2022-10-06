import "./App.css";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import DataInputs from "./DataInputs";
import styled from "styled-components";
import { useState } from "react";
import Graph from "./Graph";

const StyledBox = styled(Box)`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 3fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "graph data-inputs"
    "save data-inputs";
`;

function App() {
  const [data, setData] = useState();

  const handleDataSubmitted = (dataSubmitted) => {
    const sortedData = dataSubmitted;
    sortedData.sort((a, b) => a.x - b.x);
    setData(sortedData);
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
        <Graph data={data} />
      </StyledBox>
    </div>
  );
}

export default App;
