import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Logs from "../../components/Logs/Logs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

import "./parser.scss";
import { ipcRenderer } from "electron";

function Parser() {
  const [group, setGroup] = useState(undefined);
  const [channelError, setChannelError] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    let { id, hash, session } = JSON.parse(localStorage.getItem("apiData"));
    let apiId = parseInt(id);
    ipcRenderer.send("start", {
      group: group,
      id: apiId,
      hash: hash,
      session: session,
    });
    setIsWorking(true);
  };

  const handleChange = (e) => {
    setGroup(e.target.value.replace(/(\W|https\:\/\/t\.me)/g, ""));
  };

  ipcRenderer.on("channel-error", () => {
    setChannelError(true);
  });

  ipcRenderer.on("clear-group", () => {
    ipcRenderer.send("notify", {
      title: "Task complete",
      body: `You can get data from file: ${group}.xlsx`,
    });
    setIsWorking(false);
  });

  return (
    <div className="parser">
      <Navbar />
      <div className="wrapper">
        <div className="group">
          <div className="input-wrapper">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="group"
                label="Group"
                variant="standard"
                autoFocus={true}
                value={group}
                onChange={handleChange}
              />
            </Box>
          </div>
          {channelError ? (
            <Alert severity="error">Eror channel not found!</Alert>
          ) : (
            ""
          )}
          {!group ? (
            <Alert severity="info">Please enter telegram group link!</Alert>
          ) : (
            ""
          )}
        </div>
        <div className="logs-wrapper">
          <Logs isWorking={isWorking} />
        </div>
        <Box sx={{ "& > button": { m: 1 } }}>
          <LoadingButton
            onClick={handleClick}
            endIcon={<SendIcon />}
            loading={isWorking}
            disabled={!group}
            loadingPosition="end"
            variant="contained"
            className="button"
          >
            Fetch data
          </LoadingButton>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default Parser;
