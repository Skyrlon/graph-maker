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

  const [inputs, setInputs] = useState({
    title: "",
    axis: { first: "", second: "" },
    values: [
      { position: 0, firstInputValue: "", secondInputValue: "" },
      { position: 1, firstInputValue: "", secondInputValue: "" },
    ],
  });

  const [inputsWithSameValue, setInputsWithSameValue] = useState([]);
  const [inputsWithWrongValues, setInputsWithWrongValues] = useState([]);

  const handleTitleInputChange = (e) => {
    setInputs({
      ...inputs,
      title: e.target.value,
    });
  };

  const handleFirstAxisInputChange = (e) => {
    setInputs({
      ...inputs,
      axis: { ...inputs.axis, first: e.target.value },
    });
  };

  const handleSecondAxisInputChange = (e) => {
    setInputs({
      ...inputs,
      axis: { ...inputs.axis, second: e.target.value },
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
    const errors = [];

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

    const valueIsNotNumber = inputs.values.map((values) => {
      return {
        ...values,
        firstInputValue: isNaN(values.firstInputValue),
        secondInputValue: isNaN(values.secondInputValue),
      };
    });

    if (
      sameValues.length === 0 &&
      !valueIsNotNumber.some((x) => !!x.firstInputValue || !!x.secondInputValue)
    ) {
      setInputsWithSameValue(sameValues);
      dataSubmit(inputs);
    }
    if (sameValues.length > 0) {
      errors.push("Put same value as another input");
      setInputsWithSameValue(sameValues);
    }
    if (
      valueIsNotNumber.some((x) => !!x.firstInputValue || !!x.secondInputValue)
    ) {
      errors.push("Value is not a number");
      setInputsWithWrongValues(valueIsNotNumber);
    }
  };

  return (
    <StyledDataInputs>
      <TextField
        label="Title"
        variant="standard"
        onChange={handleTitleInputChange}
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
        />
        <TextField
          label="y-axis"
          variant="standard"
          onChange={handleSecondAxisInputChange}
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
            required
            value={values.firstInputValue}
            onChange={(e) => handleFirstInputChange(e, values.position)}
            error={
              !!inputsWithSameValue.includes(values.position) ||
              !!inputsWithWrongValues.find(
                (x) => x.position === values.position && !!x.firstInputValue
              )
            }
            helperText={
              <>
                <>
                  {!!inputsWithSameValue.includes(values.position)
                    ? sameValueErrorMessage
                    : ""}
                </>
                <br />
                <>
                  {!!inputsWithWrongValues.find(
                    (x) => x.position === values.position && !!x.firstInputValue
                  )
                    ? notNumberValueErrorMessage
                    : ""}
                </>
              </>
            }
          />
          <TextField
            required
            value={values.secondInputValue}
            onChange={(e) => handleSecondInputChange(e, values.position)}
            error={
              !!inputsWithWrongValues.find(
                (x) => x.position === values.position && !!x.secondInputValue
              )
            }
            helperText={
              !!inputsWithWrongValues.find(
                (x) => x.position === values.position && !!x.secondInputValue
              ) && notNumberValueErrorMessage
            }
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
      <Button
        disabled={inputs.values.some(
          (x) =>
            x.firstInputValue.trim().length === 0 ||
            x.secondInputValue.trim().length === 0
        )}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </StyledDataInputs>
  );
}

export default DataInputs;
