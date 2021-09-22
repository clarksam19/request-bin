import axios from "axios";
const apiUrl = "http://localhost:3000/api";

const getRequests = async (url) => {
  const res = await axios.get(apiUrl, {
    params: {
      url: url,
    },
  });
  return res.data;
};

export default getRequests;
