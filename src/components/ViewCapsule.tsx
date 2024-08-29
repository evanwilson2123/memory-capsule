"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Countdown from "react-countdown";

const ViewCapsule = () => {
  const params = useParams();
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

        // Convert unlockDate from UTC to local time zone
        const localUnlockDate = new Date(data.unlockDate);

        setCapsule({
          ...data,
          unlockDate: localUnlockDate, // Set the local time as the unlockDate
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
    return <div>{error}</div>;
  }

  if (!capsule) {
    return <div>Loading...</div>;
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
            <div className="media-content">
              {capsule.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`/api/get-file?key=${image}`}
                  alt="Memory Image"
                  className="mb-4"
                />
              ))}
              {capsule.videos.map((video: string, index: number) => (
                <video key={index} controls className="mb-4">
                  <source src={`/api/get-file?key=${video}`} type="video/mp4" />
                </video>
              ))}
              {capsule.audios.map((audio: string, index: number) => (
                <audio key={index} controls className="mb-4">
                  <source
                    src={`/api/get-file?key=${audio}`}
                    type="audio/mpeg"
                  />
                </audio>
              ))}
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
