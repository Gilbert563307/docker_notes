import React from "react";

/**
 * @typedef {Object} BS5RadioProps
 * @property {string} FILTER_TO_CHECK  CONSTANT
 * @property {string} label
 * @property {string} id
 * @property {import("react").ChangeEventHandler} onChange
 * @property {boolean} isTheInputChecked
 * @property {string} radioGroupName
 * @returns {JSX.Element}
 */

/**
 * @param {BS5RadioProps} props
 */
export default function BS5Radio({
  FILTER_TO_CHECK,
  label,
  id,
  onChange,
  isTheInputChecked,
  radioGroupName,
}) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        id={id}
        name={radioGroupName}
        checked={isTheInputChecked}
        value={FILTER_TO_CHECK}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

