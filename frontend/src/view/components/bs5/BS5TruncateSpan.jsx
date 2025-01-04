import React from "react";

/**
 *
 * @param {Object} props
 * @param {string| JSX.Element} props.content -This can be any type of text
 * @param {string| JSX.Element} [props.title] -
 * @param {string} props.maxWidthToSet -This should be a number ending with px
 * @returns
 */
export default function BS5TruncateSpan({
  content,
  maxWidthToSet,
  title = undefined,
}) {
  return (
    <span
      className="d-inline-block text-truncate own-truncate-span"
      style={{ maxWidth: maxWidthToSet }}
      title={title || content}
    >
      {content}
    </span>
  );
}
