import "./App.css";

import { AppBar, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <div className="App">
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div">
            Graph Maker
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
