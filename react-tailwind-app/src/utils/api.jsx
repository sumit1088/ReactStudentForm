const API_URL = 'http://127.0.0.1:5000/api';

// uploadService.js

export async function uploadFiles(pdfFiles) {
  const formData = new FormData();
  pdfFiles.forEach((file) => {
    formData.append('file', file); // multiple files under same key
  });

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return true;
  } catch (error) {
    console.error('Upload error:', error);
    return false;
  }
}

// Alternative single-file + optional OCR upload function (still JS, just commented)
 
// export const uploadFiles = async (pdfFile, ocrFile) => {
//   try {
//     const formData = new FormData();
//     formData.append('pdf', pdfFile);
//     if (ocrFile) formData.append('ocr', ocrFile);

//     const response = await fetch(`${API_URL}/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     return response.ok;
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     return false;
//   }
// };

export async function searchQuery(query) {
  const response = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}
