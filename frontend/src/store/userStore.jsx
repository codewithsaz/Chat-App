import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {},
  name: "",
  allUserList: [],
  setUser: (user) =>
    set((state) => ({
      user: user,
    })),
  setAllUserList: (userList) =>
    set((state) => ({
      allUserList: userList,
    })),
}));

export default useUserStore;
