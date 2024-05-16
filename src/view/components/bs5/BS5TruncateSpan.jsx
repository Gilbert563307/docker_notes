import React from "react";

/**
 * 
 * @param {Object} props
 * @param {string} props.content -This can be any type of text
 * @param {string} props.maxWidthToSet -This should be a number ending with px 
 * @returns 
 */
export default function BS5TruncateSpan({ content, maxWidthToSet }) {
  return (
    <span
      className="d-inline-block text-truncate"
      style={{ maxWidth: maxWidthToSet }}
      title={content}
    >
      {content}
    </span>
  );
}



