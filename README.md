# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Employee Component

The `Employee` component is responsible for managing and displaying employee data in a paginated table. It provides functionalities for exporting, importing, and editing employee details, as well as deleting employees.

### Key Features
- Fetches employee data from the backend with server-side pagination.
- Displays employee attributes such as ID, SSN, age, gender, marital status, etc.
- Provides export and import functionality for employee data.
- Includes action buttons for deleting employees and navigating to the edit page.
- Implements smooth animations during loading.

### Props
- **onDeleteSuccess**: A callback function triggered after a successful delete operation.

### Dependencies
- **React Hooks**: `useState`, `useEffect`, `useCallback`
- **Material-UI Components**: `DataGrid`, `Box`, `CircularProgress`
- **React Spring**: For animations
- **React Router**: For navigation
- **Custom Components**: `Headertop`, `Sidebar`, `DeleteItemComponent`
- **Icons**: `CgImport`, `TiExport`

### API Endpoints
- **Fetch Employee Rules**: `${BASE_URL}/User/EmployeeRules/`
- **Export Employees**: `API_URLS.EXPORT_EMPLOYEES`

### Usage
1. Import the `Employee` component into a parent component or route.
2. Pass the `onDeleteSuccess` prop to handle post-delete actions.
3. Ensure the backend API endpoints are configured correctly.

### Example
```jsx
import Employee from './pages/employee';

function App() {
  const handleDeleteSuccess = () => {
    console.log("Employee deleted successfully!");
  };

  return (
    <div>
      <Employee onDeleteSuccess={handleDeleteSuccess} />
    </div>
  );
}

export default App;
