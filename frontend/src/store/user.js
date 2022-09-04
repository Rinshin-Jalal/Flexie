import create from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// define the store

const useUserStore = create(
  persist((set, get) => ({
    isLoggedIn: false,
    user: null,
    BASE_URL: "http://localhost:6521",
    login: async (email, password, setError) => {
      try {
        const res = await axios.post("http://localhost:6521/api/users/login", {
          email,
          password,
        });
        set({ isLoggedIn: true, user: res.data });
        localStorage.setItem("user", JSON.stringify(res.data));
        return true;
      } catch (error) {
        setError(error.response.data.msg);

        return false;
      }
    },
    logout: () => {
      set({ isLoggedIn: false, user: null });
      localStorage.removeItem("user");
    },
    register: async (name, email, password, setError) => {
      try {
        const res = await axios.post("http://localhost:6521/api/users", {
          name,
          email,
          password,
        });
        set({ isLoggedIn: true, user: res.data });
        localStorage.setItem("user", JSON.stringify(res.data));
        return true;
      } catch (error) {
        setError(error.response.data.msg);
        return false;
      }
    },
    updateBio: async ({ setError, name, interests }) => {
      try {
        // const JWT = JSON.parse(localStorage.getItem("user")).JWT;
        const JWT = get().user.JWT;
        const res = await axios.put(
          "http://localhost:6521/api/users/me",
          {
            name,
            interests,
          },
          {
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
          }
        );
        set({ user: res.data });
        localStorage.setItem("user", JSON.stringify(res.data));
        return true;
      } catch (error) {
        setError(error.response.data.msg);
        return false;
      }
    },
    connectUser: async ({ setError, setLoading }) => {
      try {
        // const JWT = JSON.parse(localStorage.getItem("user")).JWT;
        setLoading(true);
        const JWT = get().user.JWT;
        const res = await axios.get("http://localhost:6521/api/chat/connect", {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        });
        setLoading(false);

        return { success: true, data: res.data };
      } catch (error) {
        setError(error?.response?.data.msg);
        setLoading(false);

        return {
          success: false,
        };
      }
    },

    sendMessage: async ({ setError, setLoading, channelId, message }) => {
      try {
        console.log(channelId, message);
        // const JWT = JSON.parse(localStorage.getItem("user")).JWT;
        setLoading(true);
        const JWT = get().user.JWT;
        const res = await axios.post(
          "http://localhost:6521/api/chat/sendMessage",
          {
            channelId,
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
          }
        );
        setLoading(false);
        console.log(res.data);

        return { success: true, data: res.data };
      } catch (error) {
        setError(error?.response?.data.msg);
        setLoading(false);

        return {
          success: false,
        };
      }
    },
  }))
);

export default useUserStore;
