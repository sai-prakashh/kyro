import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('kyro_token')}`
});

// Send message to KYRO with optional model preference
export const askKyro = async (message, modelId = null) => {
  const res = await axios.post(
    `${BACKEND}/api/kyro/ask`,
    { message, modelId },
    { headers: getHeaders() }
  );
  return res.data;
};

// Get all available AI models
export const getModels = async () => {
  const res = await axios.get(
    `${BACKEND}/api/kyro/models`,
    { headers: getHeaders() }
  );
  return res.data;
};

// Auth
export const getMe = async () => {
  const res = await axios.get(
    `${BACKEND}/api/auth/me`,
    { headers: getHeaders() }
  );
  return res.data;
};