import { Add, Delete } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

const StyledDataInputs = styled(Box)`
  grid-area: data-inputs;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function DataInputs() {
  const [inputs, setInputs] = useState([{ position: 0, value: "" }]);

  const handleChange = (e, position) => {
    const inputToModify = inputs.find((input) => input.position === position);
    let inputsModified = inputs;
    inputsModified.splice(inputs.indexOf(inputToModify), 1, {
      position,
      value: e.target.value,
    });
    setInputs([...inputsModified]);
  };

  const addInput = () => {
    const lastInputPosition = inputs[inputs.length - 1].position;
    setInputs([...inputs, { position: lastInputPosition + 1, value: "" }]);
  };

  const deleteInput = (inputPosition) => {
    setInputs(inputs.filter((input) => input.position !== inputPosition));
  };

  return (
    <StyledDataInputs>
      {inputs.map((input) => (
        <Box
          key={input.position}
          sx={{ display: "flex", flexDirection: "row" }}
        >
          <TextField
            type="number"
            value={input.value}
            onChange={(e) => handleChange(e, input.position)}
          />
          <IconButton onClick={() => deleteInput(input.position)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addInput} sx={{ width: "2rem", height: "2rem" }}>
        <Add />
      </IconButton>
    </StyledDataInputs>
  );
}

export default DataInputs;
