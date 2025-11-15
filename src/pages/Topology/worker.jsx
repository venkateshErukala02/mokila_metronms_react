/* eslint-env worker */
/* eslint-disable no-restricted-globals */

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
  }finally {
    self.close();  // ensure worker terminates
  }
};

