import "./App.css";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import DataInputs from "./DataInputs";
import styled from "styled-components";

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
        <DataInputs />
      </StyledBox>
    </div>
  );
}

export default App;
