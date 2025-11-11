import axios from 'axios';
import { DYMO_CONFIG } from '../../core/dymoConfig';

const headers = {
  'Authorization': `Bearer ${DYMO_CONFIG.api_key}`,
  'Content-Type': 'application/json',
};

export const checkReputation = async (domain) => {
  const res = await axios.get(`${DYMO_CONFIG.base_url}/reputation?domain=${domain}`, { headers });
  return res.data;
};

export const checkFraudScore = async (ip) => {
  const res = await axios.get(`${DYMO_CONFIG.base_url}/fraud-score?ip=${ip}`, { headers });
  return res.data;
};

export const getThreatCategories = async () => {
  const res = await axios.get(`${DYMO_CONFIG.base_url}/threat-categories`, { headers });
  return res.data;
};
