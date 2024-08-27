import axios from "axios";

const API = import.meta.env.VITE_API

export const useAxios = () => {
  return axios.create({
    baseURL: API,
  });
};
