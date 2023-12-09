import { create } from "zustand";

const useUploadMediaStore = create((set) => ({
  selectedFile: null,
  selectedFileURL: null,
  name: "",
  setSelectedFile: (selectedFile) =>
    set((state) => ({
      selectedFile: selectedFile,
    })),
  setSelectedFileURL: (selectedFileURL) =>
    set((state) => ({
      selectedFileURL: selectedFileURL,
    })),
}));

export default useUploadMediaStore;
