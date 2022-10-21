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
  const [inputsWithWrongValues, setInputsWithWrongValues] = useState([]);

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
      setErrorMessage("");
    }
    if (sameValues.length > 0) {
      setErrorMessage("Put same value as another input");
      setInputsWithSameValue(sameValues);
    }
    if (
      valueIsNotNumber.some((x) => !!x.firstInputValue || !!x.secondInputValue)
    ) {
      setErrorMessage("Value is not a number");
      setInputsWithWrongValues(valueIsNotNumber);
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
            value={values.firstInputValue}
            onChange={(e) => handleFirstInputChange(e, values.position)}
            error={
              !!inputsWithSameValue.find((x) => x === values.position) ||
              inputsWithWrongValues.find(
                (x) => x.position === values.position && !!x.firstInputValue
              )
            }
            helperText={
              (!!inputsWithSameValue.find((x) => x === values.position) ||
                inputsWithWrongValues.find(
                  (x) => x.position === values.position && !!x.firstInputValue
                )) &&
              errorMessage
            }
          />
          <TextField
            value={values.secondInputValue}
            onChange={(e) => handleSecondInputChange(e, values.position)}
            error={inputsWithWrongValues.find(
              (x) => x === values.position && !!x.secondInputValue
            )}
            helperText={
              inputsWithWrongValues.find(
                (x) => x === values.position && !!x.secondInputValue
              ) && errorMessage
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
      <Button onClick={handleSubmit}>Submit</Button>
    </StyledDataInputs>
  );
}

export default DataInputs;
