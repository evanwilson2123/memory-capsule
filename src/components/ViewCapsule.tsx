"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Countdown from "react-countdown";

const ViewCapsule = () => {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const id = params.id;
  const [capsule, setCapsule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

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

        // Convert unlockDate from UTC to local time zone
        const localUnlockDate = new Date(data.unlockDate);

        setCapsule({
          ...data,
          unlockDate: localUnlockDate, // Set the local time as the unlockDate
          images: imageUrls,
          videos: videoUrls,
          audios: audioUrls,
        });

        // Check if the unlock date has passed
        if (localUnlockDate <= new Date()) {
          setIsUnlocked(true);
        }
      } catch (err: any) {
        setError("Could not fetch the time capsule.");
      }
    };

    fetchCapsule();
  }, [id]);

  const countdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: any) => {
    if (completed) {
      setIsUnlocked(true);
      return <span>Time capsule is now unlocked!</span>;
    } else {
      return (
        <span className="text-black">
          {days} days {hours} hours {minutes} minutes {seconds} seconds
        </span>
      );
    }
  };

  if (error) {
    return <div className="text-white text-center">{error}</div>;
  }

  if (!capsule) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      {isUnlocked ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
            {capsule.title}
          </h1>
          <p className="text-gray-700 text-center mb-4">
            {capsule.description}
          </p>
          <div>
            <p className="text-gray-700 mb-4">{capsule.message}</p>
            <div className="media-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capsule.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Images
                  </h3>
                  {capsule.images.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt="Memory Image"
                      className="w-full h-auto rounded-lg shadow-lg object-cover mb-4"
                    />
                  ))}
                </div>
              )}
              {capsule.videos.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Videos
                  </h3>
                  {capsule.videos.map((url: string, index: number) => (
                    <video
                      key={index}
                      controls
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    >
                      <source src={url} type="video/mp4" />
                    </video>
                  ))}
                </div>
              )}
              {capsule.audios.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Audios
                  </h3>
                  {capsule.audios.map((url: string, index: number) => (
                    <audio
                      key={index}
                      controls
                      className="w-full rounded-lg shadow-lg mb-4"
                    >
                      <source src={url} type="audio/mpeg" />
                    </audio>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl text-center font-semibold mb-4 text-black">
            Time capsule unlocks in:
          </h2>
          <div className="text-center text-xl font-mono">
            <Countdown
              date={capsule.unlockDate} // Use the correct date for countdown
              renderer={countdownRenderer}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCapsule;
