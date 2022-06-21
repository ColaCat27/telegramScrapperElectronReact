import React, { useState, useContext } from "react";
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
import SettingsContext from "../../context/settingsContext";

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

function getStyles(name, fieldName, theme) {
  return {
    fontWeight:
      fieldName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectChip({ fields }) {
  const theme = useTheme();
  const [fieldName, setFieldName] = useState([]);

  const handleChange = (event) => {
    console.log(event);
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
  const { language, theme, notifications, dispatch } =
    useContext(SettingsContext);

  console.log(language);
  const [settings, setSettings] = useState({
    notifications: notifications,
    language: language,
    theme: theme,
  });

  const handleLang = (e) => {
    setSettings((prev) => ({ ...prev, language: e.target.value }));
    dispatch({ type: "SETTINGS", payload: settings });
  };

  const handleTheme = (e) => {
    setSettings((prev) => ({ ...prev, theme: e.target.value }));
    dispatch({ type: "THEME", payload: settings });
  };

  const handleNotifications = (e) => {
    setSettings((prev) => ({ ...prev, notifications: e.target.checked }));
    dispatch({ type: "SETTINGS", payload: settings });
  };

  return (
    <div className="settings">
      <Navbar />
      <h2>Settings</h2>
      <div className="settings__wrapper">
        <FormGroup>
          <FormControlLabel
            control={<Switch />}
            label="Notifications"
            onChange={handleNotifications}
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
                id="language"
                value={language}
                label="Language"
                sx={{ color: "#fff" }}
                onChange={handleLang}
              >
                <MenuItem value={"ua"}>UA</MenuItem>
                <MenuItem value={"eng"}>ENG</MenuItem>
              </Select>
            </FormControl>

            {/* <FormControl sx={{ width: "250px" }}>
              <InputLabel id="demo-simple-select-label" sx={{ color: "#fff" }}>
                Theme
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="theme"
                value={theme}
                label="Theme"
                sx={{ color: "#fff" }}
                onChange={handleTheme}
              >
                <MenuItem value={"white"}>White</MenuItem>
                <MenuItem value={"dark"}>Dark</MenuItem>
              </Select>
            </FormControl> */}
          </div>
          {/* <MultipleSelectChip
            sx={{ width: "200px" }}
            onChange={handleChange}
            fields={fields}
          /> */}
        </Box>
      </div>
    </div>
  );
}

export default Settings;
