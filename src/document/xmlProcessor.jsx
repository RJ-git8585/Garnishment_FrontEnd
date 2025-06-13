
/**
 * XmlProcessor Component
 * 
 * This component provides functionality for processing XML files by uploading an Excel file,
 * converting it to JSON, and performing garnishment calculations. It also includes features
 * such as displaying API responses, copying responses to the clipboard, toggling between JSON
 * and table views, and a scroll-to-top button.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered XmlProcessor component.
 * 
 * @state {number} reloadKey - A key to trigger component re-render.
 * @state {string} jsonInput - The JSON input string.
 * @state {Object|null} response - The API response object.
 * @state {string} error - Error message, if any.
 * @state {boolean} loading - Indicates whether an API call is in progress.
 * @state {boolean} showTable - Toggles between JSON and table view for the response.
 * @state {boolean} isFullscreen - Indicates whether the component is in fullscreen mode.
 * @state {File|null} file - The uploaded file (not directly used in the component).
 * @state {number|null} fileUploadTime - Time taken to upload the file in milliseconds.
 * @state {number|null} garnishmentCalcTime - Time taken for garnishment calculation in milliseconds.
 * @state {boolean} showScrollButton - Indicates whether the scroll-to-top button is visible.
 * 
 * @function reloadComponent - Resets the component state and reloads the page.
 * @function handleFileUpload - Handles the file upload process, sends the file to the server, 
 *                              and processes the response.
 * @function handleGarnishmentCalculation - Sends JSON data to the server for garnishment calculation 
 *                                          and processes the response.
 * @function handleCopy - Copies the API response to the clipboard.
 * @function toggleFullscreen - Toggles the fullscreen mode for the component.
 * @function scrollToTop - Scrolls the page to the top smoothly.
 * 
 * @useEffect - Adds an event listener to track scroll position and toggles the visibility of the 
 *              scroll-to-top button.
 * 
 * @dependencies
 * - BASE_URL: The base URL for API requests.
 * - react-icons: Icons used for UI elements.
 * - renderTable: Function to render the response as a table.
 * - exportToExcel: Function to export data to an Excel file.
 * - CSS: Styles imported from '../utils/css/xml.css'.
 */
import { BASE_URL } from '../configration/Config';
import { FaTableCells } from "react-icons/fa6";
import { FaCopy, FaExpand, FaCompress, FaArrowUp } from "react-icons/fa"; // Import FaArrowUp for the floating button
import { BsFiletypeJson, BsFiletypeXml } from "react-icons/bs";
import { useState, useRef, useEffect } from 'react';
import '../utils/css/xml.css';
import { renderTable } from '../component/TableRenderer';
import { exportToExcel } from '../component/ExcelExporter';

const XmlProcessor = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setFile] = useState(null);
  const [fileUploadTime, setFileUploadTime] = useState(null);
  const [garnishmentCalcTime, setGarnishmentCalcTime] = useState(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false); // State for showing the scroll button

  const reloadComponent = () => {
    setReloadKey(prevKey => prevKey + 1);
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setFile(null);
    setShowTable(false);
    setFileUploadTime(null);
    setGarnishmentCalcTime(null);

    // Reload the page
    window.location.reload();
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      setLoading(true);
      const startTime = new Date().getTime();

      try {
        const apiResponse = await fetch(`${BASE_URL}/User/ConvertExcelToJson`, {
          method: 'POST',
          body: formData,
        });

        const endTime = new Date().getTime();
        setFileUploadTime(endTime - startTime);

        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        setJsonInput(JSON.stringify(data, null, 2));

        await handleGarnishmentCalculation(data);
      } catch (err) {
        setError(err.message || 'An error occurred while uploading the file.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGarnishmentCalculation = async (data) => {
    try {
      setLoading(true);
      const startTime = new Date().getTime();
      const apiResponse = await fetch(`${BASE_URL}/User/garnishment_calculate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const endTime = new Date().getTime();
      setGarnishmentCalcTime(endTime - startTime);

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
      }

      const result = await apiResponse.json();
      setResponse(result);
      setShowTable(false);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2)).then(
        () => alert('Response copied to clipboard!'),
        () => alert('Failed to copy response.')
      );
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show or hide the scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <hr />
      <div className="bg_cls container" ref={containerRef}>
        <h2 className="header text-lg">Excel Batch Run</h2>
        <p className="text-sx italic mb-2">Please upload the excel file.... </p>
        {/* Display time response outside API response box */}
        <div className="timeContainer">
          {fileUploadTime !== null && (
            <p className="text-black">
              File Upload Time: <b>{fileUploadTime}</b> ms
            </p>
          )}
          {garnishmentCalcTime !== null && (
            <p className="text-black">
              Garnishment Calculation Time: <b>{garnishmentCalcTime}</b> ms
            </p>
          )}
        </div>

        <div className="columnContainer">
          <div className="inputSection">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={reloadComponent}
                disabled={loading}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all duration-200 text-sm"
              >
                {loading ? 'Loading...' : 'Reset'}
              </button>
            </div>

            <textarea
              className="textArea"
              placeholder=""
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
          </div>
          {response && (
            <div className="responseSection">
              <div className="responseHeader">
                <h3>API Response</h3>
                <div className="fucntionalButtons">
                  <button className="copyButton" onClick={handleCopy}>
                    <FaCopy />
                  </button>
                  <button className="toggleButton" onClick={() => setShowTable(!showTable)}>
                    {showTable ? <BsFiletypeJson /> : <FaTableCells />}
                  </button>
                  <button className="toggleButton" onClick={toggleFullscreen}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
              <div className="responseContainer">
                {showTable ? renderTable(response) : (
                  <pre className="responsejson">{JSON.stringify(response, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      {showScrollButton && (
        <button
          className="fixed bottom-4 text-sm right-4 bg-gray-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default XmlProcessor;
