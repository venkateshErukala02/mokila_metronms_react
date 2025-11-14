/* eslint-env worker */
/* eslint-disable no-restricted-globals */

// self.onmessage = async function (event) {
//   console.log('Worker received message:', event.data);

//   const { apiA, apiB } = event.data;

//   try {
//     const resA = await fetch(apiA);
//     console.log('Fetched API A:', resA);

//     const textA = await resA.text();
//     console.log('API A raw text:', textA);

//     const dataA = textA ? JSON.parse(textA) : [];
//     console.log('Parsed API A data:', dataA);

//     const results = [];

//     for (const item of dataA) {
//       const nodeId = item.nodeid ?? 0;
//       console.log('Fetching API B for nodeId:', nodeId);

//       const resB = await fetch(`${apiB}${nodeId}`);
//       const textB = await resB.text();
//       console.log('API B raw text for nodeId', nodeId, ':', textB);

//     //   const dataB = textB ? JSON.parse(textB) : {};
//         let dataB = {};
//         try {
//         if (textB) dataB = JSON.parse(textB);
//         } catch (err) {
//         console.error('Failed to parse API B:', textB, err);
//         }
//       results.push({ nodeId, data: dataB });
//     }

//     console.log('Posting results back to main thread:', results);
//     self.postMessage({ status: 'success', results });
//   } catch (err) {
//     console.error('Worker error caught:', err);
//     self.postMessage({ status: 'error', message: err.message });
//   }
// };


// worker.js

self.onmessage = async function (event) {
  const { nodeId, apiB } = event.data;  // Extract nodeId and API B URL from the main thread message

  try {
    // Make API call to API B using nodeId
    const response = await fetch(`${apiB}${nodeId}`);
     const contentType = response.headers.get("content-type");
    let data;
     if (contentType && contentType.includes("application/json")) {
    data = await response.json(); // Parse as JSON if it's JSON
  } else {
    data = await response.text(); // Parse as plain text if it's not JSON
  }

    // Send the result back to the main thread
    self.postMessage({ nodeId, data, status: 'success' });
  } catch (error) {
    // Send error back to main thread
    self.postMessage({ nodeId, status: 'error', message: error.message });
  }
};

