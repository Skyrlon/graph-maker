import "./App.css";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import DataInputs from "./DataInputs";
import styled from "styled-components";
import { useState } from "react";
import Graph from "./Graph";
import { sortArrayOfObjects } from "./Helpers";

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
    setData({
      ...dataSubmitted,
      sets: [
        dataSubmitted.sets.map((set) => {
          return { ...set, dots: sortArrayOfObjects(set.dots, "first") };
        }),
      ],
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
        <Graph data={data} />
      </StyledBox>
    </div>
  );
}

export default App;
