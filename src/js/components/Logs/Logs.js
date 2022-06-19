import React from "react";
import { ipcRenderer } from "electron";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { FixedSizeList } from "react-window";
import "./logs.scss";

export default class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      left: 0,
      body: [],
    };
  }

  componentDidMount() {
    ipcRenderer.on("amount", (e, message) => {
      const value = parseInt(message);
      this.setState((prev) => ({ ...prev, amount: value, left: value }));
    });

    ipcRenderer.on("data", (e, message) => {
      this.setState((prev) => ({
        ...prev,
        left: prev.amount - message.counter,
        body: prev.body.concat(message.data),
      }));
    });

    ipcRenderer.on("stop", (e, message) => {
      this.setState((prev) => ({
        amount: 0,
        left: 0,
        body: [],
        isWorking: false,
      }));
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("amount");
    ipcRenderer.removeAllListeners("data");
    ipcRenderer.removeAllListeners("stop");
  }

  render() {
    return (
      <div className="logs">
        <Box
          className="logs__wrapper"
          sx={{
            width: "100%",
            height: 240,
            bgcolor: "#0d0d1c",
            color: "#fff",
          }}
        >
          <FixedSizeList
            height={240}
            width="100%"
            itemSize={46}
            itemData={this.state.body}
            itemCount={this.state.body.length}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
        </Box>
      </div>
    );
  }
}

function renderRow(props) {
  const { index, style, data } = props;

  console.log(data);

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText
          primary={`First Name: ${data[index].firstName} Last Name: ${data[index].lastName} Username: ${data[index].username} Phone: ${data[index].phone}`}
        />
      </ListItemButton>
    </ListItem>
  );
}
