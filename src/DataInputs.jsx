import { Add, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import ColorPicker from "./ColorPicker";

const StyledDataInputs = styled(Box)`
  grid-area: data-inputs;
  padding-top: 10px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  & .scroller {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    width: 90%;
    height: 75%;
    overflow-y: auto;
  }

  @media (max-width: 767px) {
    height: 33%;
    overflow: auto;
    & .scroller {
      width: 90%;
      height: 50%;
      overflow-y: auto;
    }
  }
`;

function DataInputs({ dataSubmit }) {
  const sameValueErrorMessage = "Input have same value as another";

  const [areAllInputsNumbers, setAreAllInputsNumbers] = useState([]);

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);

  const graphTypesList = [
    { name: "linear", setName: "line" },
    { name: "bar", setName: "bar" },
    { name: "circular", setName: "slice" },
  ];

  const [graphType, setGraphType] = useState("linear");

  const [titleInput, setTitleInput] = useState("");

  const [axisInputs, setAxisInputs] = useState({ first: "", second: "" });

  const [barColors, setBarColors] = useState(["#000"]);

  const [setsInputs, setSetsInputs] = useState([]);

  const [expandedAccordions, setExpandedAccordions] = useState([0]);

  const findDuplicates = (array, index) => {
    let sortedArray = [...array].sort(
      (a, b) => a.inputs[index] - b.inputs[index]
    );
    let results = [];
    for (let i = 0; i < sortedArray.length - 1; i++) {
      if (sortedArray[i + 1].inputs[index] === sortedArray[i].inputs[index]) {
        results.push(sortedArray[i].inputs[index]);
      }
    }
    return results;
  };

  const handleTitleInputChange = (e) => {
    setTitleInput(e.target.value);
  };

  const handleFirstAxisInputChange = (e) => {
    setAxisInputs({
      ...axisInputs,
      first: e.target.value,
    });
  };

  const handleSecondAxisInputChange = (e) => {
    setAxisInputs({
      ...axisInputs,
      second: e.target.value,
    });
  };

  const handleChangeBarColors = (newColor, index) => {
    let newArray = [...barColors];
    newArray[index] = newColor;
    setBarColors(newArray);
  };

  const handleInputChange = (e, setID, groupID, inputID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            groups: set.groups.map((group) => {
              if (group.id === groupID) {
                return {
                  ...group,
                  inputs: group.inputs.map((input, index) => {
                    if (index === inputID) {
                      return e.target.value;
                    }
                    return input;
                  }),
                };
              } else {
                return group;
              }
            }),
          };
        } else {
          return set;
        }
      })
    );
  };

  const addGroup = (setID) => {
    const lastInputsID = setsInputs
      .find((set) => set.id === setID)
      .groups.find((group, index, array) => index === array.length - 1).id;
    if (graphType === "linear") {
      setSetsInputs(
        setsInputs.map((set) => {
          if (set.id === setID) {
            return {
              ...set,
              groups: [
                ...set.groups,
                { id: lastInputsID + 1, inputs: ["", ""] },
              ],
            };
          } else {
            return set;
          }
        })
      );
    } else if (graphType === "bar") {
      setSetsInputs(
        setsInputs.map((set) => {
          if (set.id === setID) {
            return {
              ...set,
              groups: [...set.groups, { id: lastInputsID + 1, inputs: [""] }],
            };
          } else {
            return set;
          }
        })
      );
    }
  };

  const deleteGroup = (setID, groupID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            groups: [...set.groups.filter((group) => group.id !== groupID)],
          };
        } else {
          return set;
        }
      })
    );
  };

  const addSet = () => {
    const setName = `New ${
      graphTypesList.find((x) => x.name === graphType).setName
    }`;
    if (graphType === "linear") {
      setSetsInputs([
        ...setsInputs,
        {
          id:
            setsInputs.length > 0
              ? setsInputs[setsInputs.length - 1].id + 1
              : 0,
          name: setName,
          color: "#000000",
          groups: [
            { id: 0, inputs: ["", ""] },
            { id: 1, inputs: ["", ""] },
          ],
        },
      ]);
    } else if (graphType === "bar" || graphType === "circular") {
      setSetsInputs([
        ...setsInputs,
        {
          id:
            setsInputs.length > 0
              ? setsInputs[setsInputs.length - 1].id + 1
              : 0,
          name: setName,
          color: "#000000",
          groups: [{ id: 0, inputs: [""] }],
        },
      ]);
    }
    setExpandedAccordions([
      ...expandedAccordions,
      setsInputs.length > 0 ? setsInputs[setsInputs.length - 1].id + 1 : 0,
    ]);
  };

  const deleteSet = (setID) => {
    setSetsInputs(setsInputs.filter((x) => x.id !== setID));
  };

  const handleSetNameChange = (e, setID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            name: e.target.value,
          };
        } else {
          return set;
        }
      })
    );
  };

  const toggleAcordion = (setID) => {
    if (expandedAccordions.includes(setID)) {
      setExpandedAccordions(expandedAccordions.filter((x) => x !== setID));
    } else if (!expandedAccordions.includes(setID)) {
      setExpandedAccordions([...expandedAccordions, setID]);
    }
  };

  const handleColorPickerChange = (color, setID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            color: color,
          };
        } else {
          return set;
        }
      })
    );
  };

  const handleSubmit = () => {
    let sameValues = [];
    const errors = [];

    sameValues = setsInputs.map((set) => {
      return {
        id: set.id,
        duplicates: findDuplicates(set.groups, 0),
      };
    });

    const areAllInputsNumeric = setsInputs.map((set) => {
      return {
        ...set,
        groups: set.groups.map((group) => {
          return {
            ...group,
            inputs: group.inputs.map(
              (input) => !!Number(input) || Number(input) === 0
            ),
          };
        }),
      };
    });

    setAreAllInputsNumbers(areAllInputsNumeric);

    if (
      (!sameValues.some((set) => set.duplicates.length > 0) ||
        (sameValues.some((set) => set.duplicates.length > 0) &&
          graphType !== "linear")) &&
      areAllInputsNumeric.every((set) =>
        set.groups.every((group) => group.inputs.every((input) => !!input))
      )
    ) {
      dataSubmit({
        graphType,
        title: titleInput,
        barColors,
        axis: axisInputs,
        sets: setsInputs,
      });
    }
    if (sameValues.some((set) => set.duplicates.length > 0)) {
      errors.push("Got same value as another input");
    }

    setInputsWithSameValue(sameValues);
  };

  useEffect(
    () => {
      setsInputs.length = 0;
      addSet();
    },
    // eslint-disable-next-line
    [graphType]
  );

  return (
    <StyledDataInputs>
      <TextField
        select
        variant="outlined"
        label="Graph type"
        sx={{ width: "10rem", textTransform: "capitalize" }}
        value={graphType}
        onChange={(e) => setGraphType(e.target.value)}
      >
        {graphTypesList.map((graphTypeItem) => (
          <MenuItem
            key={graphTypeItem.name}
            value={graphTypeItem.name}
            sx={{ width: "10rem", textTransform: "capitalize" }}
          >
            {graphTypeItem.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Title"
        variant="standard"
        onChange={handleTitleInputChange}
        value={titleInput}
      />
      {graphType !== "circular" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="x-axis"
            variant="standard"
            onChange={handleFirstAxisInputChange}
            value={axisInputs.first}
          />
          <TextField
            label="y-axis"
            variant="standard"
            onChange={handleSecondAxisInputChange}
            value={axisInputs.second}
          />
        </Box>
      )}

      {graphType === "bar" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "20rem",
            marginBottom: "1rem",
          }}
        >
          <Typography sx={{ marginRight: "1rem" }}>Sub bars colors</Typography>
          <ButtonGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[...setsInputs]
              .sort((a, b) => b.groups.length - a.groups.length)[0]
              .groups.map((x, index) => index)
              .map((x, index) => (
                <ColorPicker
                  key={x}
                  color={barColors[index] ? barColors[index] : "#000"}
                  changeColor={(color) => handleChangeBarColors(color, index)}
                >
                  {index + 1}
                </ColorPicker>
              ))}
          </ButtonGroup>
        </Box>
      )}

      <div className="scroller">
        {setsInputs.map((set) => (
          <Accordion
            key={set.id}
            expanded={expandedAccordions.includes(set.id)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon onClick={() => toggleAcordion(set.id)} />
              }
            >
              <TextField
                variant="standard"
                onChange={(e) => handleSetNameChange(e, set.id)}
                value={set.name}
              />
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ColorPicker
                  color={set.color}
                  changeColor={(color) =>
                    handleColorPickerChange(color, set.id)
                  }
                />
                {set.id !== 0 && <Delete onClick={() => deleteSet(set.id)} />}
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {set.groups.map((group) => (
                <Box
                  key={group.id}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "80%",
                  }}
                >
                  {group.inputs.map((input, index) => (
                    <TextField
                      required
                      key={index}
                      value={group.inputs[index]}
                      onChange={(e) =>
                        handleInputChange(e, set.id, group.id, index)
                      }
                      error={
                        (index === 0 &&
                          graphType === "linear" &&
                          !!inputsWithSameValue.some(
                            (x) =>
                              x.id === set.id &&
                              x.duplicates.includes(group.inputs[index])
                          )) ||
                        (areAllInputsNumbers.length > 0 &&
                          areAllInputsNumbers
                            ?.find((x) => x.id === set.id)
                            ?.groups.find((y) => y.id === group.id)?.inputs[
                            index
                          ] === false)
                      }
                      helperText={
                        <>
                          {index === 0 &&
                          graphType === "linear" &&
                          !!inputsWithSameValue.some(
                            (x) =>
                              x.id === set.id &&
                              x.duplicates.includes(group.inputs[index])
                          ) ? (
                            <>
                              {sameValueErrorMessage}
                              <br />
                            </>
                          ) : null}
                          {areAllInputsNumbers.length > 0 &&
                            areAllInputsNumbers
                              ?.find((x) => x.id === set.id)
                              ?.groups.find((y) => y.id === group.id)?.inputs[
                              index
                            ] === false &&
                            "Not a number"}
                        </>
                      }
                    />
                  ))}
                  {!(
                    group.id === 0 ||
                    (graphType === "linear" && group.id === 1)
                  ) && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "0%",
                        left: "100%",
                        transform: "translate(0%, 25%)",
                      }}
                      onClick={() => deleteGroup(set.id, group.id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
            </AccordionDetails>

            {graphType !== "circular" && (
              <IconButton
                onClick={() => addGroup(set.id)}
                sx={{ width: "2rem", height: "2rem" }}
              >
                <Add />
              </IconButton>
            )}
          </Accordion>
        ))}
      </div>
      <Button onClick={addSet}>
        Add new {graphTypesList.find((x) => x.name === graphType).setName}
      </Button>
      <Button
        disabled={setsInputs.some((set) =>
          set.groups.some((group) =>
            group.inputs.some((input) => input.trim().length === 0)
          )
        )}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </StyledDataInputs>
  );
}

export default DataInputs;
