import React from 'react'

/**
 * A mapping of error codes to corresponding SVG elements.
 * Displays different animations depending on the error code.
 *
 * @param code - The error code to determine which SVG to render.
 * @returns An SVG element corresponding to the error code.
 */
const ErrorSVG: React.FC<{ code: number }> = ({ code }) => {
  const errorSVGs: { [key: number | string]: JSX.Element } = {
    400: (
      <svg className="h-24 w-24 text-accent animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.75L4.75 12H19.25L12 4.75Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19.25V12M4.75 19.25H19.25"/>
      </svg>
    ),
    401: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 9.75l4.5 4.5M14.25 9.75l-4.5 4.5"/>
      </svg>
    ),
    403: (
      <svg className="h-24 w-24 text-accent animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.25 12H4.75M12 19.25V12"/>
      </svg>
    ),
    404: (
      <svg className="h-24 w-24 text-accent animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 9.75l4.5 4.5M14.25 9.75l-4.5 4.5"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    500: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.75L4.75 12H19.25L12 4.75Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19.25V12M4.75 19.25H19.25"/>
      </svg>
    ),
    503: (
      <svg className="h-24 w-24 text-accent animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.75 12H19.25"/>
      </svg>
    ),
    default: (
      <svg className="h-24 w-24 text-accent animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2"/>
      </svg>
    ),
  }

  return errorSVGs[code] || errorSVGs.default
}

export default ErrorSVG
