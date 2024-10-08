// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const Test = () => {
  // State to hold the number of fields and field values
  const [numFields, setNumFields] = useState(0);
  const [fieldValues, setFieldValues] = useState([]);

  // Handle number input change
  const handleNumberChange = (e) => {
    const number = parseInt(e.target.value) || 0;
    setNumFields(number);

    // Adjust the field values array based on the number of fields
    setFieldValues(new Array(number).fill(''));
  };

  // Handle dynamic field value changes
  const handleFieldChange = (index, value) => {
    const updatedValues = [...fieldValues];
    updatedValues[index] = value;
    setFieldValues(updatedValues);
  };

  return (
    <div>
      <label>Enter number of fields:</label>
      <input 
        type="number" 
        min="0" 
        onChange={handleNumberChange} 
        placeholder="Enter a number" 
      />
      
      {numFields > 0 && (
        <div>
          {Array.from({ length: numFields }).map((_, index) => (
            <div key={index}>
              <label>Field {index + 1}:</label>
              <input
                type="text"
                value={fieldValues[index] || ''}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <pre>Values: {JSON.stringify(fieldValues, null, 2)}</pre>
    </div>
  );
};

export default Test;
