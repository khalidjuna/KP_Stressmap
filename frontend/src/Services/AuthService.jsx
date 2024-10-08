// import React, { useState, useEffect } from "react";

// [POST] https://example.com/api/auth/v1/login
/**
Method          : POST
Protocol        : https
domain          : example.com
is_backend      : true (/api)
module          : auth
endpoint version: v1:username-password:deprecated, v2:phone_number-password, v3:face_file-username, v4:email-password, v5:email-otp
handler         : login
 */

// app.post("/api/auth/:version/login")
/**
{
  "token": "dshfdsfekhdkhfd"
}
 */
import axiosInstance from "../Utils/AxiosUtil.jsx";

export const register = async ({
  role_id,
  name,
  email,
  password,
  confirmPassword,
  position,
  institution,
  city,
  country,
  image_url,
}) => {
  const result = await axiosInstance.post("/api/v1/register", {
    role_id,
    name,
    email,
    password,
    confirmPassword,
    position,
    institution,
    city,
    country,
    image_url,
  });

  if (result.success) {
    // success...
    const data = result.data;
    if (typeof data?.token == "string") {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        message: "Backend error...",
      };
    }
  } else {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const login = async ({ email, password }) => {
  const result = await axiosInstance.post("/api/v1/login", {
    email,
    password,
  });

  if (result.success) {
    // success...
    const data = result.data;
    if (typeof data?.token == "string") {
      localStorage.setItem("token", data.token);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: "Backend error...",
      };
    }
  } else {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const init = async (setStore) => {
  const result = await axiosInstance.get(`/api/auth/v1/init`);

  if (result.success) {
    // success...
    const data = result.data.data;
    console.log({ data });
    setStore({ ...data });
    return {
      success: true,
    };
  } else {
    // error...
    return {
      success: false,
      message: result.message,
    };
  }
};

export const logout = async () => {
  const result = await axiosInstance.delete("/api/auth/v1/logout");

  if (result.success) {
    // success...
    localStorage.removeItem("token");
    return {
      success: true,
    };
  } else {
    // error...
    return {
      success: false,
      message: result.message,
    };
  }
};