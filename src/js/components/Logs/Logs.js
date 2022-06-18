import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import LinearProgress from "@mui/material/LinearProgress";
import "./logs.scss";

function renderRow(props) {
  const { index, style, data } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`User: ${data[index].firstName}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Logs({ isWorking }) {
  const [data, setData] = useState({
    amount: 0,
    left: 0,
    body: [],
    isWorking: isWorking,
  });

  useEffect(() => {
    ipcRenderer.on("amount", (e, message) => {
      const value = parseInt(message);
      setData((prev) => ({ ...prev, amount: value, left: value }));
    });

    ipcRenderer.on("data", (e, message) => {
      setData((prev) => ({
        ...prev,
        left: prev.amount - message.counter,
        body: prev.body.concat(message.data),
      }));
    });

    ipcRenderer.on("stop", (e, message) => {
      setData((prev) => ({ ...prev, left: 0, isWorking: false }));
    });
  });

  return (
    <Box
      className="logs"
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
        itemData={data}
        itemCount={data.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
