/**
 * A React functional component that renders a checkbox and conditionally displays text
 * based on the checkbox's state.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage example:
 * import ConditionalText from './Color';
 * 
 * function App() {
 *   return <ConditionalText />;
 * }
 *
 * @description
 * - The component uses the `useState` hook to manage the state of the checkbox.
 * - When the checkbox is checked, a paragraph of text is displayed below it.
 * - The `handleCheckboxChange` function updates the state when the checkbox is toggled.
 */
import React, { useState } from 'react';

function ConditionalText() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          aria-label="Show text"
        />
        Show Text
      </label>
      {isChecked && (
        <p>This is the text that will be shown when the checkbox is checked.</p>
      )}
    </div>
  );
}

export default ConditionalText;