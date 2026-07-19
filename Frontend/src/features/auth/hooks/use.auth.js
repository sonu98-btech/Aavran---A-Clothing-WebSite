import { setUser, setError, setLoading } from "../state/auth.slice";
import { register, login, getMe, logout } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function registerHandler({
    email,
    contact,
    password,
    fullname,
    isSeller,
  }) {
    dispatch(setLoading(true));
    try {
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return data.user;
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.message || "Registration failed"),
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function loginHandler({ email, password }) {
    dispatch(setLoading(true));
    try {
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return data.user;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function getMeHandle() {
    dispatch(setLoading(true));
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
      dispatch(setError(null));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        dispatch(setUser(null));
        dispatch(setError(null));
      } else {
        dispatch(
          setError(
            err?.response?.data?.message || "Unable to verify authentication",
          ),
        );
      }
      // Do not rethrow here; App bootstraps auth silently.
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function logoutHandler() {
    dispatch(setLoading(true));
    try {
      await logout();
      dispatch(setUser(null));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    registerHandler,
    loginHandler,
    getMeHandle,
    logoutHandler,
  };
};
