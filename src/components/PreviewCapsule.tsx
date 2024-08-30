"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; // Import useRouter

const PreviewCapsule = () => {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const id = params.id;
  const [capsule, setCapsule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCapsule = async () => {
      try {
        const response = await axios.get(`/api/time-capsule/${id}`);
        const data = response.data;

        // Fetch signed URLs for images, videos, and audios
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
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
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
        <div className="media-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capsule.images.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Images</h3>
              {capsule.images.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt="Memory Image"
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
              ))}
            </div>
          )}
          {capsule.videos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Videos</h3>
              {capsule.videos.map((url: string, index: number) => (
                <video
                  key={index}
                  controls
                  className="w-full h-auto rounded-lg shadow-lg"
                >
                  <source src={url} type="video/mp4" />
                </video>
              ))}
            </div>
          )}
          {capsule.audios.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Audios</h3>
              {capsule.audios.map((url: string, index: number) => (
                <audio
                  key={index}
                  controls
                  className="w-full rounded-lg shadow-lg"
                >
                  <source src={url} type="audio/mpeg" />
                </audio>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewCapsule;
