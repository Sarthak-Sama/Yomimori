import React from "react";
import "./ToggleSwitch.css"; // Import the CSS for the toggle switch

const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <div className="toggle-switch">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="toggle-switch-checkbox"
        id={`toggle-switch`}
        type="checkbox"
      />
      <label className="toggle-switch-label" htmlFor={`toggle-switch`}>
        <span className={`toggle-switch-inner`} />
        <span className={`toggle-switch-switch`} />
      </label>
    </div>
  );
};

export default ToggleSwitch;
