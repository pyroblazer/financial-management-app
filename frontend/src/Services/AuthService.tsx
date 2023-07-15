// frontend/src/Services/AuthService.tsx
import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const api = `${process.env.REACT_APP_API_URL}/api/`;

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "account/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    console.log("email, username, password", email, username, password);
    const data = await axios.post<UserProfileToken>(api + "account/register", {
      email: email,
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    // Don't handle the error here - let it bubble up to the calling component
    // so it can display the specific validation errors
    console.error("Registration error:", error);
    throw error; // Re-throw the error
  }
};