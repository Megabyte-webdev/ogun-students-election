import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://voting-system-mocha.vercel.app/",
});
