import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Logs from "../../components/Logs/Logs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { withSnackbar } from "notistack";
import "./parser.scss";
import { ipcRenderer } from "electron";

class Parser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: "",
      channelError: false,
      isWorking: false,
      isComplete: false,
      amount: 0,
      left: 0,
      body: [],
    };
  }

  componentDidMount() {
    ipcRenderer.on("channel-error", () => {
      this.setState((prev) => ({ ...prev, channelError: true }));
    });

    ipcRenderer.on("clear-group", () => {
      ipcRenderer.send("notify", {
        title: "Task complete",
        body: `You can get data from file: ${group}.xlsx`,
      });
      this.setState((prev) => ({ ...prev, isWorking: false }));
    });

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
        ...prev,
        amount: 0,
        left: 0,
        // body: [],
        isComplete: true,
        isWorking: false,
      }));
      this.key = this.props.enqueueSnackbar("All tasks completed!", {
        variant: "success",
      });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("amount");
    ipcRenderer.removeAllListeners("data");
    ipcRenderer.removeAllListeners("stop");
  }

  handleClick = (e) => {
    e.preventDefault();
    let { id, hash, session } = JSON.parse(localStorage.getItem("apiData"));
    let apiId = parseInt(id);
    ipcRenderer.send("start", {
      group: this.state.group,
      id: apiId,
      hash: hash,
      session: session,
    });
    this.setState((prev) => ({ ...prev, isComplete: false, isWorking: true }));
  };

  handleChange = (e) => {
    this.setState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.replace(/(\W|https\:\/\/t\.me)/g, ""),
    }));
  };

  handleDelete = () => {
    this.setState((prev) => ({
      ...prev,
      body: [],
    }));
  };

  handleClear = () => {
    this.setState((prev) => ({
      ...prev,
      group: "",
    }));
  };

  render() {
    return (
      <div className="parser">
        <Navbar />
        <div className="parser__wrapper">
          <div className="parser__group">
            <div className="parser__inputs">
              <TextField
                id="group"
                label="Group"
                variant="standard"
                autoFocus={true}
                value={this.state.group}
                onChange={this.handleChange}
              />
              {this.state.group ? (
                <IconButton
                  aria-label="delete"
                  size="medium"
                  color="primary"
                  className="parser__clear"
                  onClick={this.handleClear}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              ) : (
                ""
              )}

              {this.state.channelError ? (
                <Alert severity="error" className="alert">
                  Eror channel not found!
                </Alert>
              ) : (
                ""
              )}
              {!this.state.group ? (
                <Alert severity="info" className="alert">
                  Please enter telegram group link!
                </Alert>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="parser__logs">
            <Logs isWorking={this.state.isWorking} data={this.state.body} />
          </div>
          <Box sx={{ "& > button": { m: 1 } }} className="parser__buttons">
            <LoadingButton
              onClick={this.handleClick}
              endIcon={<SendIcon />}
              loading={this.state.isWorking}
              disabled={!this.state.group}
              loadingPosition="end"
              variant="contained"
              className="button"
            >
              Fetch data
            </LoadingButton>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              disabled={!this.state.isComplete}
              onClick={this.handleDelete}
              className="button"
            >
              Delete logs
            </Button>
          </Box>
        </div>
      </div>
    );
  }
}

export default withSnackbar(Parser);
