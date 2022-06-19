import React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { FixedSizeList } from "react-window";
import "./logs.scss";

export default class Logs extends React.Component {
  constructor(props) {
    super(props);
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
            itemData={this.props.data}
            itemCount={this.props.data.length}
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
