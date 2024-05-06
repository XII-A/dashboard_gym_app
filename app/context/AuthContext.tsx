// AuthContext
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  authLoading?: boolean;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http:/192.168.1.101:1337/api";
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
  //   useEffect(() => {
  //     console.log("the auth state in context: ", authState);
  //   }, [authState]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAuthState({ token: token, authenticated: true });
          setAuthLoading(false);
        } else {
          setAuthLoading(false);
        }
      } catch (error) {
        console.log(error);
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

  const login = async (email: string, password: string) => {
    try {
      const res = await axios({
        url: "http://192.168.1.101:1337/api/auth/local",
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
