import { Add, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import styled from "styled-components";
import { SketchPicker } from "react-color";
import { ClickAwayListener } from "@mui/base";

const StyledDataInputs = styled(Box)`
  grid-area: data-inputs;
  padding-top: 10px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  & .color {
    &-button {
      background-color: black;
      &:hover {
        background-color: black;
        opacity: 0.75;
      }
    }
    &-picker {
      position: absolute;
      background-color: white;
      z-index: 2;
    }
  }
`;

function DataInputs({ dataSubmit }) {
  const sameValueErrorMessage = "Input have same value as another";

  const graphTypesList = ["linear", "bar"];

  const [graphType, setGraphType] = useState("linear");

  const [titleInput, setTitleInput] = useState("");

  const [axisInputs, setAxisInputs] = useState({ first: "", second: "" });

  const [setsInputs, setSetsInputs] = useState([
    {
      id: 0,
      name: "Set 1",
      color: "#000000",
      groups: [
        { id: 0, inputs: ["", ""] },
        { id: 1, inputs: ["", ""] },
      ],
    },
  ]);

  const [expandedAccordions, setExpandedAccordions] = useState([0]);

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);

  const [showColorPicker, setShowColorPicker] = useState(undefined);

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

  const handleInputChange = (e, setID, groupID, inputID) => {
    const regex = /^\d*\.?\d*$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
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
    }
  };

  const addGroup = (setID) => {
    const lastInputsID = setsInputs
      .find((set) => set.id === setID)
      .groups.find((group, index, array) => index === array.length - 1).id;
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            groups: [...set.groups, { id: lastInputsID + 1, inputs: ["", ""] }],
          };
        } else {
          return set;
        }
      })
    );
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
    setSetsInputs([
      ...setsInputs,
      {
        id: setsInputs[setsInputs.length - 1].id + 1,
        name: "New set",
        color: "#000000",
        groups: [
          { id: 0, inputs: ["", ""] },
          { id: 1, inputs: ["", ""] },
        ],
      },
    ]);
    setExpandedAccordions([
      ...expandedAccordions,
      setsInputs[setsInputs.length - 1].id + 1,
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

  const handleColorButtonClick = (setID) => {
    if (showColorPicker === setID) {
      setShowColorPicker(null);
    } else {
      setShowColorPicker(setID);
    }
  };

  const handleColorPickerChange = (color, setID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            color: color.hex,
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

    if (!sameValues.some((set) => set.duplicates.length > 0)) {
      dataSubmit({
        graphType,
        title: titleInput,
        axis: axisInputs,
        sets: setsInputs,
      });
    }
    if (sameValues.some((set) => set.duplicates.length > 0)) {
      errors.push("Got same value as another input");
    }

    setInputsWithSameValue(sameValues);
  };

  return (
    <StyledDataInputs>
      <TextField
        select
        variant="outlined"
        label="Graph type"
        value={graphType}
        onChange={(e) => setGraphType(e.target.value)}
      >
        {graphTypesList.map((graphTypeItem) => (
          <MenuItem key={graphTypeItem} value={graphTypeItem}>
            {graphTypeItem}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Title"
        variant="standard"
        onChange={handleTitleInputChange}
        value={titleInput}
      />
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

      {setsInputs.map((set) => (
        <Accordion key={set.id} expanded={expandedAccordions.includes(set.id)}>
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
            <Box sx={{ position: "relative" }}>
              <IconButton
                variant="contained"
                size="medium"
                sx={{
                  backgroundColor: set.color,
                  "&:hover": { backgroundColor: set.color, opacity: 0.75 },
                }}
                onClick={() => handleColorButtonClick(set.id)}
              />
              {showColorPicker === set.id && (
                <ClickAwayListener
                  onClickAway={() => setShowColorPicker(undefined)}
                >
                  <SketchPicker
                    className="color-picker"
                    color={set.color}
                    onChange={(color, e) =>
                      handleColorPickerChange(color, set.id)
                    }
                  />
                </ClickAwayListener>
              )}
              {set.id !== 0 && <Delete onClick={() => deleteSet(set.id)} />}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {set.groups.map((group) => (
              <Box
                key={group.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                      index === 0 &&
                      !!inputsWithSameValue.some(
                        (x) =>
                          x.id === set.id &&
                          x.duplicates.includes(group.inputs[index])
                      )
                    }
                    helperText={
                      <>
                        {index === 0 &&
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
                      </>
                    }
                  />
                ))}
                {!(group.id === 0 || group.id === 1) && (
                  <IconButton onClick={() => deleteGroup(set.id, group.id)}>
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
          </AccordionDetails>

          <IconButton
            onClick={() => addGroup(set.id)}
            sx={{ width: "2rem", height: "2rem" }}
          >
            <Add />
          </IconButton>
        </Accordion>
      ))}

      <Button onClick={addSet}>Add new set</Button>

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
