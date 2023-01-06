import "./App.css";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
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
  height: calc(100vh - 64px);
  & .carousel {
    height: 100%;
    display: grid;
    grid-template-columns: 75% 25%;
    grid-template-rows: 75% 25%;
    gap: 0px 0px;
    grid-template-areas:
      "graph data-inputs"
      "save data-inputs";
  }

  .carousel {
    &-button {
      &-top {
        display: none;
      }
      &-bottom {
        display: none;
      }
    }
  }

  @media (max-width: 767px) {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;

    & .carousel {
      display: block;
      height: 300%;
      &.inputs {
        transform: translateY(0%);
      }
      &.graph {
        transform: translateY(calc(-33% - 56px));
      }
      &.download {
        transform: translateY(calc(-66% - 56px));
      }
      &-button {
        &-top {
          display: block;
          z-index: 2;
          position: absolute;
          left: 0;
          top: 56px;
        }
        &-bottom {
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
    }
  }
`;

function App() {
  const [data, setData] = useState();

  const [svgData, setSvgData] = useState();

  const [sectionShowed, setSectionShowed] = useState("inputs");

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
        {(sectionShowed === "graph" || sectionShowed === "download") && (
          <Button
            className="carousel-button-top"
            onClick={() =>
              setSectionShowed(sectionShowed === "graph" ? "inputs" : "graph")
            }
          >
            {sectionShowed === "graph" ? "Inputs" : "Graph"}
          </Button>
        )}
        <div className={`carousel ${sectionShowed}`}>
          <DataInputs dataSubmit={handleDataSubmitted} />
          <Graph data={data} sendSvgData={(x) => setSvgData(x)} />
          <DownloadSection svgData={{ ...svgData, title: data?.title }} />
        </div>
        {(sectionShowed === "inputs" || sectionShowed === "graph") && (
          <Button
            className="carousel-button-bottom"
            onClick={() =>
              setSectionShowed(
                sectionShowed === "inputs" ? "graph" : "download"
              )
            }
          >
            {sectionShowed === "inputs" ? "Graph" : "Download"}
          </Button>
        )}
      </StyledBox>
    </StyledApp>
  );
}

export default App;
