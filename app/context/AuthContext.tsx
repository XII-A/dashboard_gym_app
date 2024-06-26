// AuthContext
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  authLoading?: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    created_at: string;
    updated_at: string;
    name: string;
    surname: string;
    birthday: string;
    weight: number | string;
    user_id: string;
    profilepicUrl: string;
    height: number | string;
    caloriesGoal: number | string;
    workoutsGoal: number | string;
    stepsGoal: number | string;
    waterGoal: number | string;
  } | null;
  onRegister?: (email: string, password: string) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  getMe?: () => Promise<void>;
  updateSchedule?: boolean;
  setUpdateSchedule?: React.Dispatch<React.SetStateAction<boolean>>;
  updateOverview?: boolean;
  setUpdateOverview?: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfile?: boolean;
  setUpdateProfile?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TOKEN_KEY = "my-jwt";
// CHANGE 192.168.1.101 to your own ip address if the backend doesnt work
export const API_URL = `${process.env.EXPO_PUBLIC_API_URL}`;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  //   useEffect(() => {
  //     console.log("the auth state in context: ", authState);
  //   }, [authState]);

  // states for updating pages after changes
  // updating the schedule page after adding a new workout
  const [updateSchedule, setUpdateSchedule] = useState(false);
  // updating the overview page after doing a workout or a new meal
  const [updateOverview, setUpdateOverview] = useState(false);
  // checking if the user has made a change to his data in profile page and wants to leave before saving the changes
  const [updateProfile, setUpdateProfile] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAuthState({ token: token, authenticated: true });
          const getUser = await axios({
            url: `${API_URL}/users/me`,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          setUser(getUser.data);
          setAuthLoading(false);
        } else {
          setAuthLoading(false);
        }
      } catch (error) {
        console.log("error in loadToken in context", error);
        setAuthLoading(false);
      }
    };
    loadToken();
  }, []);

  //!!! template register function DO NOT USE
  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/register`, { email, password });
    } catch (error) {
      return error;
    }
  };

  const getMe = async () => {
    try {
      const res = await axios({
        url: `${API_URL}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(res.data);
      return;
    } catch (error) {
      console.log("error in getMe in context", error);
      return error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios({
        url: `${API_URL}/auth/local`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      setAuthState({ token: res.data.jwt, authenticated: true });

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.jwt}`;

      await SecureStore.setItemAsync(TOKEN_KEY, res.data.jwt);

      const getUser = await axios({
        url: `${API_URL}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUser(getUser.data);

      return res;
    } catch (error) {
      console.log("error message", error.message);
      return error;
    }
  };

  const logout = async () => {
    try {
      // Delete the token from the secure store
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // Remove the token from the axios headers
      axios.defaults.headers.common["Authorization"] = "";
      // Set the auth state to null
      setAuthState({ token: null, authenticated: false });
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    authLoading,
    user,
    updateSchedule,
    setUpdateSchedule,
    updateOverview,
    setUpdateOverview,
    updateProfile,
    setUpdateProfile,
    getMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
