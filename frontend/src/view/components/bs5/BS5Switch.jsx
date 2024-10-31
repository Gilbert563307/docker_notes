import React from "react";

/**
 * @typedef {Object} BS5SwitchProps
 * @property {string} label
 * @property {string} id
 * @property {import("react").ChangeEventHandler} onChange
 * @property {boolean} isTheInputChecked
 * @returns {JSX.Element}
 */

/**
 * @param {BS5SwitchProps} props
 */
export default function BS5Switch({
  label,
  id,
  onChange,
  isTheInputChecked,
}) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={isTheInputChecked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

