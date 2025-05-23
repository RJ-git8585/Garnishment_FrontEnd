
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
import  { React ,useState } from 'react';

function ConditionalText() {
  const [isChecked, setIsChecked] = useState(false); // Initial checkbox state

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  return (
    <div>
      <input
        type="checkbox"
        id="myCheck"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="myCheck">Show Text</label>
      {isChecked && ( // Conditionally render the text
        <p id="text">This is the text that will be shown when the checkbox is checked.</p>
      )}
    </div>
  );
}

export default ConditionalText;