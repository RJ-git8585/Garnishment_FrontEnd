/**
 * OrdImport Component
 * 
 * This component provides a form for uploading files and submitting them to the server.
 * It includes file upload functionality, employer ID input, and displays success or error messages
 * based on the server response.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Order Upload Form component.
 * 
 * @example
 * <OrdImport />
 * 
 * @dependencies
 * - React hooks: useState
 * - Material-UI components: Button, Box, Grid, Input, Typography, CircularProgress
 * - Custom components: Headertop, Sidebar
 * - Configuration: BASE_URL from '../configration/Config'
 * - SweetAlert2 for alert notifications
 * 
 * @state {string} empID - The employer ID entered by the user.
 * @state {File|null} upload - The file selected by the user for upload.
 * @state {boolean} loading - Indicates whether the form submission is in progress.
 * @state {string} error - Stores error messages to display to the user.
 * @state {string} success - Stores success messages to display to the user.
 * 
 * @function handleReset - Resets the form fields and clears error/success messages.
 * @function handleSubmit - Handles the form submission, validates input, sends the file and employer ID
 *                          to the server, and updates the UI based on the response.
 * @function handleUploadClick - Handles the form submission using SweetAlert2.
 * 
 * @remarks
 * - The file input accepts `.csv`, `.pdf`, `.doc`, and `.docx` file formats.
 * - Displays a loading spinner on the submit button while the form is being processed.
 * - Uses Material-UI for styling and layout.
 */
import { useState } from 'react';
import { API_URLS } from '../configration/apis';
import axios from 'axios';
import Swal from 'sweetalert2';

function OrdImport() {
  // Add this swalConfig object before handleUploadClick
  const swalConfig = {
    customClass: {
      confirmButton: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
      cancelButton: 'px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-3'
    },
    buttonsStyling: false
  };

  const handleUploadClick = () => {
    Swal.fire({
      title: 'Order Upload Form',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700">Employer ID</label>
            <input 
              id="employer_id" 
              class="mt-1 block w-full border rounded-md shadow-sm p-2" 
              placeholder="Enter Employer ID"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Upload File</label>
            <input
              id="file_upload"
              type="file"
              accept=".csv,.pdf,.doc,.docx"
              class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      ...swalConfig,
      preConfirm: async () => {
        const fileInput = document.getElementById('file_upload');
        const employerId = document.getElementById('employer_id').value;
        const file = fileInput.files[0];

        if (!file) {
          Swal.showValidationMessage('Please select a file to upload');
          return false;
        }

        if (!employerId) {
          Swal.showValidationMessage('Please enter an Employer ID');
          return false;
        }

        // Return the form data for confirmation
        return {
          file,
          employerId,
          fileName: file.name
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
          title: 'Confirm Upload',
          html: `
            <div class="text-left">
              <p class="mb-2">Please confirm the following details:</p>
              <ul class="list-disc pl-5">
                <li>Employer ID: ${result.value.employerId}</li>
                <li>File Name: ${result.value.fileName}</li>
              </ul>
              <p class="mt-4 text-sm text-gray-600">Are you sure you want to proceed with the upload?</p>
            </div>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Upload',
          cancelButtonText: 'No, Cancel',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33'
        });

        if (confirmResult.isConfirmed) {
          try {
            const formData = new FormData();
            formData.append('file', result.value.file);
            formData.append('employer_id', result.value.employerId);

            const response = await axios.post(API_URLS.UPSERT_ORDER, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            await Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'File uploaded successfully!',
              allowOutsideClick: false,
            });

            // Refresh the page after successful upload
            window.location.reload();
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: error.response?.data?.error || 'Failed to upload file',
            });
          }
        }
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">Order Upload</h4>
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload New Order
        </button>
      </div>
    </div>
  );
}

export default OrdImport;