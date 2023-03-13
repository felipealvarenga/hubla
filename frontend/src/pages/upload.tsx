import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { UploadedFile } from '@/types';
import Layout from '@/components/Layout';

function UploadPage () {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<{ statusCode: number; message: string } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFile(response.data);
    } catch (error: any) {
      const status = error.response ? error.response.data.statusCode : 500;
      const message = error.response.data.message || 'Something went wrong';
      setError({ statusCode: status, message: message });
    };
  }

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Error {error.statusCode}</title>
        </Head>
        <div style={{ background: 'white', color: 'black' }} className="mx-auto max-w-lg">
          <h1 className="text-2xl font-semibold mb-4">Error {error.statusCode}</h1>
          {error.message && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
              <p>{error.message}</p>
            </div>
          )}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => setError(null)}
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Upload a File</title>
      </Head>
      <div style={{ background: 'white', color: 'black' }} className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Upload a File</h1>
        {uploadedFile && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
            <p>
              Uploaded file
            </p>
          </div>
        )}
        <form className="space-y-4">
          <div>
            <label htmlFor="fileInput" className="font-semibold">
              Select a file to upload:
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileSelect}
              accept=".txt"
            />
          </div>
          <button
            type="button"
            className="text-black font-bold text-lg px-6 py-3 border-2  rounded-lg hover:bg-green-900  transition duration-300 ease-in-out mt-6"
            style={{ backgroundColor: '#D8F55F' }}
            onClick={handleUpload}
          >
            Upload
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default UploadPage;
