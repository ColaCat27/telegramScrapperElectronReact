import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import { settingsContext } from "../../context/settingsContext.js";
import "./settings.scss";
import Navbar from "../../components/Navbar/Navbar.js";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// const SettingsContext = useContext(settingsContext);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const fields = ["firstName", "lastName", "username", "phone"];

function getStyles(name, fieldName, theme) {
  return {
    fontWeight:
      fieldName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectChip() {
  const theme = useTheme();
  const [fieldName, setFieldName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFieldName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ width: 300 }}>
        <InputLabel
          id="demo-multiple-chip-label"
          style={{
            color: "#fff",
          }}
        >
          Find data settings
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={fieldName}
          onChange={handleChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Find data settings"
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  style={{ color: "#fff", backgroundColor: "#1976d2" }}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {fields.map((field) => (
            <MenuItem
              key={field}
              value={field}
              style={getStyles(field, fieldName, theme)}
            >
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function Settings() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div className="settings">
      <Navbar />
      <h2>Settings</h2>
      <div className="settings__wrapper">
        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Notifications"
          />
        </FormGroup>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div className="settings__inputs">
            <FormControl sx={{ width: "250px", marginBottom: "20px" }}>
              <InputLabel id="demo-simple-select-label" sx={{ color: "#fff" }}>
                Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Language"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: "250px" }}>
              <InputLabel id="demo-simple-select-label" sx={{ color: "#fff" }}>
                Theme
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Theme"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <MultipleSelectChip sx={{ width: "200px" }} />
        </Box>
      </div>
    </div>
  );
}

export default Settings;
