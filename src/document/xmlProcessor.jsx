import React, { useState, useRef } from 'react';
import { BASE_URL } from '../Config';
import Headertop from '../component/Headertop';
import Sidebar from '../component/sidebar';
import FileUpload from './components/FileUpload';
import ApiResponse from './components/ApiResponse';
import TableRenderer from './components/TableRenderer';
import './xml.css';

const XmlProcessor = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileUploadTime, setFileUploadTime] = useState(null);
  const [garnishmentCalcTime, setGarnishmentCalcTime] = useState(null);
  const containerRef = useRef(null);

  const reloadComponent = () => {
    setReloadKey((prevKey) => prevKey + 1);
    setJsonInput('');
    setResponse(null);
    setError('');
    setLoading(false);
    setShowTable(false);
    setFileUploadTime(null);
    setGarnishmentCalcTime(null);
  };

  const handleFileUpload = async (uploadedFile) => {
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

  return (
    <div className="min-h-full" key={reloadKey}>
      <div className="container main ml-auto">
        <div className="sidebar hidden lg:block">
          <Sidebar />
        </div>
        <div className="contant content ml-auto customBatchProcessing">
          <Headertop />
          <hr />
          <div className="bg_cls container" ref={containerRef}>
            <h2 className="header">Batch Processor</h2>
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
              <FileUpload
                onFileUpload={handleFileUpload}
                onReset={reloadComponent}
                loading={loading}
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                error={error}
              />
              {response && (
                <ApiResponse
                  response={response}
                  showTable={showTable}
                  setShowTable={setShowTable}
                  containerRef={containerRef}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                >
                  <TableRenderer response={response} />
                </ApiResponse>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XmlProcessor;
