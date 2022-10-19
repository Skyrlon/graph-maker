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
  const [inputs, setInputs] = useState({
    titles: { first: "", second: "" },
    values: [
      { position: 0, firstInputValue: "", secondInputValue: "" },
      { position: 1, firstInputValue: "", secondInputValue: "" },
    ],
  });

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFirstTitleInputChange = (e) => {
    setInputs({
      ...inputs,
      titles: { ...inputs.titles, first: e.target.value },
    });
  };

  const handleSecondTitleInputChange = (e) => {
    setInputs({
      ...inputs,
      titles: { ...inputs.titles, second: e.target.value },
    });
  };

  const handleFirstInputChange = (e, position) => {
    setInputs({
      ...inputs,
      values: inputs.values.map((values) => {
        if (values.position === position) {
          return { ...values, firstInputValue: e.target.value };
        }
        return values;
      }),
    });
  };

  const handleSecondInputChange = (e, position) => {
    setInputs({
      ...inputs,
      values: inputs.values.map((values) => {
        if (values.position === position) {
          return { ...values, secondInputValue: e.target.value };
        }
        return values;
      }),
    });
  };

  const addInput = () => {
    const lastInputPosition = inputs.values[inputs.values.length - 1].position;
    setInputs({
      ...inputs,
      values: [
        ...inputs.values,
        {
          position: lastInputPosition + 1,
          firstInputValue: "",
          secondInputValue: "",
        },
      ],
    });
  };

  const deleteInput = (inputPosition) => {
    setInputs(inputs.filter((input) => input.position !== inputPosition));
  };

  const handleSubmit = () => {
    const sameValues = [];

    inputs.values.forEach((a) => {
      if (
        inputs.values.find(
          (b) =>
            a.firstInputValue === b.firstInputValue && a.position !== b.position
        )
      ) {
        sameValues.push(a.position);
      }
    });
    if (sameValues.length === 0) {
      setInputsWithSameValue(sameValues);
      dataSubmit(inputs);
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
        <TextField
          label="x-axis"
          variant="standard"
          onChange={handleFirstTitleInputChange}
        />
        <TextField
          label="y-axis"
          variant="standard"
          onChange={handleSecondTitleInputChange}
        />
      </Box>

      {inputs.values.map((values) => (
        <Box
          key={values.position}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextField
            type="number"
            value={values.firstInputValue}
            onChange={(e) => handleFirstInputChange(e, values.position)}
            error={!!inputsWithSameValue.find((x) => x === values.position)}
            helperText={errorMessage}
          />
          <TextField
            type="number"
            value={values.secondInputValue}
            onChange={(e) => handleSecondInputChange(e, values.position)}
          />
          {!(values.position === 0 || values.position === 1) && (
            <IconButton onClick={() => deleteInput(values.position)}>
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
