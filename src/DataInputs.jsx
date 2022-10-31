import { Add, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import styled from "styled-components";

const StyledDataInputs = styled(Box)`
  grid-area: data-inputs;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

function DataInputs({ dataSubmit }) {
  const sameValueErrorMessage = "Input have same value as another";

  const notNumberValueErrorMessage = "Value is not a number";

  const [titleInput, setTitleInput] = useState("");

  const [axisInputs, setAxisInputs] = useState({ first: "", second: "" });

  const [setsInputs, setSetsInputs] = useState([
    {
      id: 0,
      name: "Set 1",
      dots: [
        { id: 0, first: "", second: "" },
        { id: 1, first: "", second: "" },
      ],
    },
  ]);

  const [expandedAccordions, setExpandedAccordions] = useState([0]);

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);
  const [inputsWithWrongValues, setInputsWithWrongValues] = useState([]);

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

  const handleFirstInputChange = (e, setID, inputsID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            dots: set.dots.map((dot) => {
              if (dot.id === inputsID) {
                return { ...dot, first: e.target.value };
              } else {
                return dot;
              }
            }),
          };
        } else {
          return set;
        }
      })
    );
  };

  const handleSecondInputChange = (e, setID, inputsID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            dots: set.dots.map((dot) => {
              if (dot.id === inputsID) {
                return { ...dot, second: e.target.value };
              } else {
                return dot;
              }
            }),
          };
        } else {
          return set;
        }
      })
    );
  };

  const addInput = (setID) => {
    const lastInputsID = setsInputs
      .find((set) => set.id === setID)
      .dots.find((dot, index, array) => index === array.length - 1).id;
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            dots: [
              ...set.dots,
              { id: lastInputsID + 1, first: "", second: "" },
            ],
          };
        } else {
          return set;
        }
      })
    );
  };

  const deleteInput = (setID, inputsID) => {
    setSetsInputs(
      setsInputs.map((set) => {
        if (set.id === setID) {
          return {
            ...set,
            dots: [...set.dots.filter((dot) => dot.id !== inputsID)],
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
        dots: [
          { id: 0, first: "", second: "" },
          { id: 1, first: "", second: "" },
        ],
      },
    ]);
    setExpandedAccordions([
      ...expandedAccordions,
      setsInputs[setsInputs.length - 1].id + 1,
    ]);
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

  const handleSubmit = () => {
    let sameValues = [];
    const errors = [];

    sameValues = setsInputs.map((set) => {
      return {
        ...set,
        dots: set.dots.map((dot, index, array) => {
          return {
            ...dot,
            first: !!array.find((x) => x.first === dot.first && x.id !== index),
          };
        }),
      };
    });

    const valueIsNotNumber = setsInputs.map((set) => {
      return {
        ...set,
        dots: set.dots.map((dot) => {
          return {
            ...dot,
            first: isNaN(dot.first),
            second: isNaN(dot.second),
          };
        }),
      };
    });

    if (
      !sameValues.some((set) => set.dots.some((dot) => !!dot.first)) &&
      !valueIsNotNumber.some((set) =>
        set.dots.some((dot) => !!dot.first || !!dot.second)
      )
    ) {
      dataSubmit({ title: titleInput, axis: axisInputs, sets: setsInputs });
    }
    if (!sameValues.some((set) => set.dots.some((dot) => !!dot.first))) {
      errors.push("Got same value as another input");
    }
    if (
      valueIsNotNumber.some((set) =>
        set.dots.some((dot) => !!dot.first || !!dot.second)
      )
    ) {
      errors.push("Value is not a number");
    }
    setInputsWithSameValue(sameValues);
    setInputsWithWrongValues(valueIsNotNumber);
  };

  return (
    <StyledDataInputs>
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
          </AccordionSummary>
          <AccordionDetails>
            {set.dots.map((dot) => (
              <Box
                key={dot.id}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  required
                  value={dot.first}
                  onChange={(e) => handleFirstInputChange(e, set.id, dot.id)}
                  error={
                    !!inputsWithSameValue.some(
                      (x) =>
                        x.id === set.id &&
                        x.dots.some((y) => !!y.first && y.id === dot.id)
                    ) ||
                    (inputsWithWrongValues.length > 0 &&
                      !!inputsWithWrongValues.some(
                        (x) =>
                          x.id === set.id &&
                          x.dots.some((y) => !!y.first && y.id === dot.id)
                      ))
                  }
                  helperText={
                    <>
                      <>
                        {!!inputsWithSameValue.some(
                          (x) =>
                            x.id === set.id &&
                            x.dots.some((y) => !!y.first && y.id === dot.id)
                        )
                          ? sameValueErrorMessage
                          : ""}
                      </>
                      <br />
                      <>
                        {!!inputsWithWrongValues.some(
                          (x) =>
                            x.id === set.id &&
                            x.dots.some((y) => !!y.first && y.id === dot.id)
                        )
                          ? notNumberValueErrorMessage
                          : ""}
                      </>
                    </>
                  }
                />
                <TextField
                  required
                  value={dot.second}
                  onChange={(e) => handleSecondInputChange(e, set.id, dot.id)}
                  error={
                    !!inputsWithWrongValues.some(
                      (x) =>
                        x.id === set.id &&
                        x.dots.some((y) => !!y.second && y.id === dot.id)
                    )
                  }
                  helperText={
                    !!inputsWithWrongValues.some(
                      (x) =>
                        x.id === set.id &&
                        x.dots.some((y) => !!y.second && y.id === dot.id)
                    )
                      ? notNumberValueErrorMessage
                      : ""
                  }
                />
                {!(dot.id === 0 || dot.id === 1) && (
                  <IconButton onClick={() => deleteInput(set.id, dot.id)}>
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
          </AccordionDetails>

          <IconButton
            onClick={() => addInput(set.id)}
            sx={{ width: "2rem", height: "2rem" }}
          >
            <Add />
          </IconButton>
        </Accordion>
      ))}

      <Button onClick={addSet}>Add new set</Button>

      <Button
        disabled={setsInputs.some((set) =>
          set.dots.some(
            (dot) =>
              dot.first.trim().length === 0 || dot.second.trim().length === 0
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
