"use client";

import React, { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Import the spinner icon from react-icons

const TimeCapsuleForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [unlockDate, setUnlockDate] = useState(""); // Unlock Date state
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [audios, setAudios] = useState<File[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [responseMessage, setResponseMessage] = useState<string | null>(null); // Response message state

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    currentFiles: File[],
    fileType: string
  ) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`${fileType} ${file.name} is too large. Max size is 10MB.`);
          return false;
        }
        return true;
      });

      setFiles((prevFiles) => {
        if (prevFiles.length + validFiles.length > MAX_FILES) {
          alert(`You can only upload up to ${MAX_FILES} ${fileType}s.`);
          return prevFiles;
        }
        return [...prevFiles, ...validFiles];
      });
      e.target.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setImages, images, "image");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setVideos, videos, "video");

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setAudios, audios, "audio");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("message", message);
    formData.append("senderName", senderName);
    formData.append("recipientEmail", recipientEmail);
    formData.append("recipientName", recipientName);
    formData.append("recipientPhone", recipientPhone);
    formData.append("unlockDate", unlockDate); // Append unlock date

    images.forEach((image) => {
      formData.append("image", image);
    });

    videos.forEach((video) => {
      formData.append("video", video);
    });

    audios.forEach((audio) => {
      formData.append("audio", audio);
    });

    try {
      const response = await axios.post(
        "/api/time-capsule/create-time-capsule",
        formData
      );

      if (response.status === 201) {
        setResponseMessage("Time capsule created successfully");
        // Clear form fields on success
        setTitle("");
        setDescription("");
        setMessage("");
        setSenderName("");
        setRecipientEmail("");
        setRecipientName("");
        setRecipientPhone("");
        setUnlockDate("");
        setImages([]);
        setVideos([]);
        setAudios([]);
      } else {
        setResponseMessage(response.data.error);
      }
    } catch (error: any) {
      setResponseMessage("An error occurred. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <FaSpinner className="text-white text-6xl animate-spin" />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mt-12 space-y-8 relative ${
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">
          Create Your Time Capsule
        </h2>

        <section className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Unlock Date
            </label>
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-gray-700">
            Who is this to?
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Recipient Phone
            </label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-gray-700">
            From:
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Your Full Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-gray-700">
            Upload Media
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Images (up to 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2 text-gray-700"
            />
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {images.map((file, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg text-center text-sm text-black truncate"
                  title={file.name} // Show full file name on hover
                >
                  {file.name.length > 20
                    ? `${file.name.slice(0, 20)}...`
                    : file.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Videos (up to 5)
            </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full mt-2 text-gray-700"
            />
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {videos.map((file, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg text-center text-sm text-black"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">
              Audios (up to 5)
            </label>
            <input
              type="file"
              multiple
              accept="audio/*"
              onChange={handleAudioChange}
              className="w-full mt-2 text-gray-700"
            />
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {audios.map((file, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-2 rounded-lg text-center text-sm text-black"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Time Capsule"}
        </button>

        {responseMessage && (
          <div className="mt-6 text-center">
            <p
              className={`font-semibold ${
                responseMessage.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {responseMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default TimeCapsuleForm;
