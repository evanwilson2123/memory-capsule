"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loading from "./Loading";
import { FaImage, FaVideo, FaMusic } from "react-icons/fa";

const PreviewCapsule = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [capsule, setCapsule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCapsule = async () => {
      try {
        const response = await axios.get(`/api/time-capsule/${id}`);
        const data = response.data;

        const fetchFiles = async (files: string[]) => {
          const promises = files.map(async (file) => {
            const fileResponse = await axios.get(`/api/get-file?key=${file}`);
            return fileResponse.data.url;
          });
          return await Promise.all(promises);
        };

        const imageUrls = await fetchFiles(data.images);
        const videoUrls = await fetchFiles(data.videos);
        const audioUrls = await fetchFiles(data.audios);

        setCapsule({
          ...data,
          images: imageUrls,
          videos: videoUrls,
          audios: audioUrls,
        });
      } catch (err: any) {
        setError("Could not fetch the time capsule.");
      }
    };

    fetchCapsule();
  }, [id]);

  const handleContinue = () => {
    router.push("/"); // Redirect to the dashboard
  };

  if (error) {
    return <div className="text-white text-center">{error}</div>;
  }

  if (!capsule) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl transform transition-transform hover:scale-105 duration-500">
        <h1 className="text-5xl font-extrabold text-center text-indigo-600 mb-8">
          {capsule.title}
        </h1>
        <p className="text-gray-700 text-center mb-8 text-lg">
          {capsule.description}
        </p>
        <div className="mb-8">
          <h2 className="text-2xl text-center font-semibold text-gray-700 mb-4">
            Message
          </h2>
          <p className="text-gray-800 p-4 bg-gray-100 rounded-lg shadow-inner text-justify leading-relaxed">
            {capsule.message}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mb-10">
          <div className="text-center w-full">
            <FaImage className="text-6xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-700">Images</h3>
            <div className="space-y-4">
              {capsule.images.length > 0 ? (
                capsule.images.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt="Memory Image"
                    className="w-full h-40 object-cover rounded-lg shadow-lg"
                  />
                ))
              ) : (
                <p className="text-gray-500">No Images Uploaded</p>
              )}
            </div>
          </div>
          <div className="text-center w-full">
            <FaVideo className="text-6xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-700">Videos</h3>
            <div className="space-y-4">
              {capsule.videos.length > 0 ? (
                capsule.videos.map((url: string, index: number) => (
                  <video
                    key={index}
                    controls
                    className="w-full h-40 object-cover rounded-lg shadow-lg"
                  >
                    <source src={url} type="video/mp4" />
                  </video>
                ))
              ) : (
                <p className="text-gray-500">No Videos Uploaded</p>
              )}
            </div>
          </div>
          <div className="text-center w-full">
            <FaMusic className="text-6xl text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-gray-700">Audios</h3>
            <div className="space-y-4">
              {capsule.audios.length > 0 ? (
                capsule.audios.map((url: string, index: number) => (
                  <audio
                    key={index}
                    controls
                    className="w-full h-40 rounded-lg shadow-lg"
                  >
                    <source src={url} type="audio/mpeg" />
                  </audio>
                ))
              ) : (
                <p className="text-gray-500">No Audios Uploaded</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <button
            onClick={handleContinue}
            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-500 transition duration-300 transform hover:scale-110"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewCapsule;
