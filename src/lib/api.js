/**
 * Utility function for making API calls
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body for POST/PUT requests
 * @returns {Promise<Object>} - The response data
 */
export const fetchApi = async (url, options = {}) => {
  const { method = 'GET', body } = options;
  
  try {
    // Make sure URL has the proper API prefix
    const apiUrl = url.startsWith('/api/') ? url : `/api/${url}`;
    
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API call failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

/**
 * GET request helper
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The response data
 */
export const get = (url) => fetchApi(url);

/**
 * POST request helper
 * @param {string} url - The API endpoint URL
 * @param {Object} body - Request body
 * @returns {Promise<Object>} - The response data
 */
export const post = (url, body) => fetchApi(url, { method: 'POST', body });

/**
 * PUT request helper
 * @param {string} url - The API endpoint URL
 * @param {Object} body - Request body
 * @returns {Promise<Object>} - The response data
 */
export const put = (url, body) => fetchApi(url, { method: 'PUT', body });

/**
 * DELETE request helper
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The response data
 */
export const del = (url) => fetchApi(url, { method: 'DELETE' }); 