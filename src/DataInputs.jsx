import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton, TextField } from "@mui/material";
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
      dots: [
        { id: 0, first: "", second: "" },
        { id: 1, first: "", second: "" },
      ],
    },
  ]);

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
        <Box key={set.id}>
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
                  (inputsWithSameValue.length > 0 &&
                    !!inputsWithSameValue
                      .find((x) => x.id === set.id)
                      .dots.find(
                        (x) => dot.first === true && x.id === dot.id
                      )) ||
                  (inputsWithWrongValues.length > 0 &&
                    !!inputsWithWrongValues
                      .find((x) => x.id === set.id)
                      .dots.find((x) => dot.first === true && x.id === dot.id))
                }
                helperText={
                  <>
                    <>
                      {inputsWithSameValue.length > 0 &&
                        (!!inputsWithSameValue
                          .find((x) => x.id === set.id)
                          .dots.find(
                            (x) => dot.first === true && x.id === dot.id
                          )
                          ? sameValueErrorMessage
                          : "")}
                    </>
                    <br />
                    <>
                      {inputsWithWrongValues.length > 0 &&
                      !!inputsWithWrongValues
                        .find((x) => x.id === set.id)
                        .dots.find((x) => dot.first === true && x.id === dot.id)
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
                  inputsWithWrongValues.length > 0 &&
                  !!inputsWithWrongValues
                    .find((x) => x.id === set.id)
                    .dots.find((x) => dot.second === true && x.id === dot.id)
                }
                helperText={
                  inputsWithWrongValues.length > 0 &&
                  !!inputsWithWrongValues
                    .find((x) => x.id === set.id)
                    .dots.find((x) => dot.second === true && x.id === dot.id)
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

          <IconButton
            onClick={() => addInput(set.id)}
            sx={{ width: "2rem", height: "2rem" }}
          >
            <Add />
          </IconButton>
        </Box>
      ))}

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
