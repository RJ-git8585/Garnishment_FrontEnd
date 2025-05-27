import React from 'react';
import Employee from './employee';
import ErrorBoundary from '../component/ErrorBoundary';

function EmployeeWrapper() {
  return (
    <ErrorBoundary>
      <Employee />
    </ErrorBoundary>
  );
}

export default EmployeeWrapper;
