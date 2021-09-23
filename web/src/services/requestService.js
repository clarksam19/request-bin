import axios from "axios";
const apiUrl = "http://localhost:3000/api";
const ngrokUrl = "http://localhost:3000/ngrok";

const getRequests = async (url) => {
  const res = await axios.get(apiUrl, {
    params: {
      url: url,
    },
  });
  return res.data;
};

const getUrl = async () => {
  const res = await axios.get(ngrokUrl);
  return res.data;
};

export { getRequests, getUrl };
