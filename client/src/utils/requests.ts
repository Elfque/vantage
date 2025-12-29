import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { handleLogOut } from "./functions";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string;
}

const axiosInstance = async () => {
  const session = await getSession();
  const token = session?.accessToken;

  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      ...(token && { authorization: `Bearer ${token}` }),
    },
  });

  // instance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     if (error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       try {
  //         const res = await axios.post(
  //           `${baseUrl}/auth/refresh_token`,
  //           {},
  //           {
  //             withCredentials: true,
  //           }
  //         );

  //         if (res.data.ok) {
  //           const newAccessToken = res.data.accessToken;

  //           instance.defaults.headers.common[
  //             "authorization"
  //           ] = `Bearer ${newAccessToken}`;
  //           originalRequest.headers[
  //             "authorization"
  //           ] = `Bearer ${newAccessToken}`;

  //           return instance(originalRequest);
  //         }
  //       } catch (refreshError) {
  //         window.location.href = "/auth";
  //         return Promise.reject(refreshError);
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );
  return instance;
};

const getAPIRequest = async (url: string) => {
  try {
    const api = await axiosInstance();
    const req = await api.get(url);
    return req.data;
  } catch (error: any) {
    // if (error.response.status === 401) {
    //   handleLogOut();
    // }
    throw error;
  }
};
const postAPIRequest = async (url: string, payload: any) => {
  try {
    const api = await axiosInstance();
    const req = await api.post(url, payload);
    return req.data;
  } catch (error: any) {
    // if (error.response.status === 401) {
    //   handleLogOut();
    // }
    throw error;
  }
};
const putAPIRequest = async (url: string, payload: any) => {
  try {
    const api = await axiosInstance();
    const req = await api.put(url, payload);
    return req.data;
  } catch (error: any) {
    // if (error.response.status === 401) {
    //   handleLogOut();
    // }
    throw error;
  }
};
const deleteAPIRequest = async (url: string) => {
  try {
    const api = await axiosInstance();
    const req = await api.delete(url);
    return req.data;
  } catch (error: any) {
    // if (error.response.status === 401) {
    //   handleLogOut();
    // }
    throw error;
  }
};

export {
  axiosInstance,
  getAPIRequest,
  postAPIRequest,
  putAPIRequest,
  deleteAPIRequest,
};
