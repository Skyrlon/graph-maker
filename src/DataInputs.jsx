import { Box, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

const StyledDataInputs = styled(Box)`
  grid-area: data-inputs;
  border: 1px solid;
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

  return (
    <StyledDataInputs>
      {inputs.map((input) => (
        <TextField
          key={input.position}
          type="number"
          value={input.value}
          onChange={(e) => handleChange(e, input.position)}
        />
      ))}
    </StyledDataInputs>
  );
}

export default DataInputs;
