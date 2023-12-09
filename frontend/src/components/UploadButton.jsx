import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import useUploadMediaStore from "../store/uploadMediaStore";
const UploadButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { selectedFile, selectedFileURL, setSelectedFile, setSelectedFileURL } =
    useUploadMediaStore((state) => ({
      selectedFile: state.selectedFile,
      selectedFileURL: state.selectedFileURL,
      setSelectedFile: state.setSelectedFile,
      setSelectedFileURL: state.setSelectedFileURL,
    }));

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFileURL(e.target.result);
      };
      reader.readAsDataURL(file); // You can change this to read other types of content
    } else {
      setSelectedFileURL(null);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxSize: 5242880,
    });
  function handleOpen() {
    onOpenChange();
    setSelectedFile(null);
    setSelectedFileURL(null);
  }
  function handleSelect() {
    onOpenChange();
  }
  return (
    <>
      <button onClick={onOpen} className="">
        <Icon
          icon="fluent:attach-20-regular"
          height={30}
          width={30}
          className="pb-2 hover:text-green-500"
        />
      </button>
      <Modal isOpen={isOpen} onOpenChange={handleOpen}>
        <ModalContent>
          {(handleOpen) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select your file
              </ModalHeader>
              <ModalBody>
                <div className=" h-52 border-2 border-dashed border-green-500/100 p-5 flex flex-col justify-center items-center rounded-lg ">
                  {/* <FolderOpenIcon className="h-10 w-10" />
            <p>Drag and Drop files to upload</p>
            <input type="file" onChange={handleFileChange} /> */}
                  <div
                    {...getRootProps({
                      className: isDragActive
                        ? " w-full h-full border-2 border-dashed bg-gray-400 text-white  p-5 flex flex-col justify-center items-center rounded-xl"
                        : " w-full h-full   p-5 flex flex-col justify-center items-center rounded-xl",
                    })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                </div>
                {fileRejections
                  ? fileRejections.map(({ file, errors }) =>
                      errors.map((e) => (
                        <p className=" text-red-900" key={e.code}>
                          {e.message}
                        </p>
                      ))
                    )
                  : ""}
                {selectedFile && (
                  <div className="h-max">
                    <p>Selected File:</p>
                    {selectedFile.type.startsWith("image") && (
                      <Image src={selectedFileURL} className=" max-w-xs h-48" />
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={handleOpen}>
                  Cancel
                </Button>
                <Button color="primary" onClick={handleSelect}>
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadButton;
