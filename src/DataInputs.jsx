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
  const [inputs, setInputs] = useState([
    { position: 0, firstInputValue: "", secondInputValue: "" },
    { position: 1, firstInputValue: "", secondInputValue: "" },
  ]);

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFirstInputChange = (e, position) => {
    setInputs(
      inputs.map((input) => {
        if (input.position === position) {
          return { ...input, firstInputValue: e.target.value };
        }
        return input;
      })
    );
  };

  const handleSecondInputChange = (e, position) => {
    setInputs(
      inputs.map((input) => {
        if (input.position === position) {
          return { ...input, secondInputValue: e.target.value };
        }
        return input;
      })
    );
  };

  const addInput = () => {
    const lastInputPosition = inputs[inputs.length - 1].position;
    setInputs([
      ...inputs,
      {
        position: lastInputPosition + 1,
        firstInputValue: "",
        secondInputValue: "",
      },
    ]);
  };

  const deleteInput = (inputPosition) => {
    setInputs(inputs.filter((input) => input.position !== inputPosition));
  };

  const handleSubmit = () => {
    const dataToSubmit = inputs.map((input) => {
      return { x: input.firstInputValue, y: input.secondInputValue };
    });
    const sameValues = [];

    inputs.forEach((a) => {
      if (
        inputs.find(
          (b) =>
            a.firstInputValue === b.firstInputValue && a.position !== b.position
        )
      ) {
        sameValues.push(a.position);
      }
    });
    if (sameValues.length === 0) {
      setInputsWithSameValue(sameValues);
      dataSubmit(dataToSubmit);
      setErrorMessage("");
    } else {
      setErrorMessage("Put same value as another input");
      setInputsWithSameValue(sameValues);
    }
  };

  return (
    <StyledDataInputs>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextField label="x-axis" variant="standard"></TextField>
        <TextField label="y-axis" variant="standard"></TextField>
      </Box>

      {inputs.map((input) => (
        <Box
          key={input.position}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextField
            type="number"
            value={input.firstInputValue}
            onChange={(e) => handleFirstInputChange(e, input.position)}
            error={!!inputsWithSameValue.find((x) => x === input.position)}
            helperText={errorMessage}
          />
          <TextField
            type="number"
            value={input.secondInputValue}
            onChange={(e) => handleSecondInputChange(e, input.position)}
          />
          {!(input.position === 0 || input.position === 1) && (
            <IconButton onClick={() => deleteInput(input.position)}>
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}
      <IconButton onClick={addInput} sx={{ width: "2rem", height: "2rem" }}>
        <Add />
      </IconButton>
      <Button onClick={handleSubmit}>Submit</Button>
    </StyledDataInputs>
  );
}

export default DataInputs;
