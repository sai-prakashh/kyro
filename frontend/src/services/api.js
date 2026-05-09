import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('kyro_token')}`
});

export const askKyro = async (message) => {
  const res = await axios.post(
    `${BACKEND}/api/kyro/ask`,
    { message },
    { headers: getHeaders() }
  );
  return res.data;
};