// const API_BASE_URL = "/ornms/api/v2";
// const TOKEN='YWRtaW46YWRtaW4='

// const getAuthToken = () => {
//     return TOKEN; // Assuming token is stored in localStorage
//     // console.log('toookk',localStorage.getItem("authToken"))

// };


// const getAuthHeaders = () => {
//     const token = getAuthToken();
//     return token ? { "Authorization": `Bearer ${token}` } : {};
// };

// const fetchWithAuth = async (endpoint, options = {}) => {
//     const headers = {
//         "Content-Type": "application/json",
//         ...getAuthHeaders(),
//         ...options.headers,
//     };

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    
//     if (!response.ok) {
//         if (response.status === 401) {
//             console.error("Unauthorized. Redirect to login or handle session expiry.");
//             // You can clear the token and redirect to login
//             localStorage.removeItem("authToken");
//             window.location.href = "/login";
//         }
//         throw new Error("API request failed");
//     }
//     return response.json();
// };

// export { API_BASE_URL, getAuthToken, getAuthHeaders, fetchWithAuth };

const API_BASE_URL = "http://localhost:8980/metronms";
