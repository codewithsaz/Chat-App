import { create } from "zustand";

const groupChatStore = create((set) => ({
  groups: {},
  groupsCout: 0,
  allUserList: [],
  setChangeGroupsCount: (userList) =>
    set((state) => ({
      allUserList: userList,
    })),
}));

export default groupChatStore;
