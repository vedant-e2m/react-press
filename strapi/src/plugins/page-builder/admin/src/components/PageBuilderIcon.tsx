import React from 'react';

/**
 * Simple pencil/layout icon used for the Page Builder menu link.
 */
function PageBuilderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3zM13.5 6.5l3 3"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M14 19h6"
      />
    </svg>
  );
}

export default PageBuilderIcon;
