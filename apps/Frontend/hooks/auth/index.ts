import { useAuthActions } from "./useAuthActions";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const authActions = useAuthActions();
  const authStore = useAuthStore();

  return {
    ...authActions,
    ...authStore,
  };
};

export { useAuthInit } from "./useAuthInit";
