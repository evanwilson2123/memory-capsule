"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ITimeCapsule } from "@/models/TimeCapsule";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

interface Profile {
  timeCapsulesCreated: ITimeCapsule[];
  timeCapsulesReceived: ITimeCapsule[];
}

const Profile = () => {
  const { isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isSignedIn || !user?.id) {
          return;
        }

        const response = await axios.get(
          `/api/profile/${user.id}/${user.emailAddresses[0]}`
        );

        console.log(response.data);

        const fetchFiles = async (files: string[]) => {
          const promises = files.map(async (file) => {
            const fileResponse = await axios.get(`/api/get-file?key=${file}`);
            return fileResponse.data.url;
          });
          return await Promise.all(promises);
        };

        // Fetch media URLs for created time capsules
        const timeCapsulesCreatedWithMedia = await Promise.all(
          response.data.timeCapsulesCreated.map(
            async (capsule: ITimeCapsule) => {
              const imageUrls = await fetchFiles(capsule.images);
              const videoUrls = await fetchFiles(capsule.videos);
              const audioUrls = await fetchFiles(capsule.audios);

              return {
                ...capsule,
                images: imageUrls,
                videos: videoUrls,
                audios: audioUrls,
              };
            }
          )
        );

        // Fetch media URLs for received time capsules
        const timeCapsulesReceivedWithMedia = await Promise.all(
          response.data.timeCapsulesReceived.map(
            async (capsule: ITimeCapsule) => {
              const imageUrls = await fetchFiles(capsule.images);
              const videoUrls = await fetchFiles(capsule.videos);
              const audioUrls = await fetchFiles(capsule.audios);

              return {
                ...capsule,
                images: imageUrls,
                videos: videoUrls,
                audios: audioUrls,
              };
            }
          )
        );

        setProfile({
          timeCapsulesCreated: timeCapsulesCreatedWithMedia,
          timeCapsulesReceived: timeCapsulesReceivedWithMedia,
        });
      } catch (error: any) {
        setError("Could not fetch the profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isSignedIn, user?.id]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCapsuleClick = (id: string) => {
    router.push(`/view-capsule/${id}`);
  };

  // Helper to check if the unlock date has passed
  const isUnlocked = (unlockDate: Date) => {
    const currentDate = new Date();
    // const capsuleUnlockDate = new Date(unlockDate);
    return currentDate >= new Date(unlockDate);
  };

  return (
    <div className="profile-container min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">
        Your Time Capsules
      </h1>

      {/* Time Capsules Created */}
      <h2 className="text-2xl font-semibold text-white mb-6">Created</h2>
      {profile && profile.timeCapsulesCreated.length > 0 ? (
        profile.timeCapsulesCreated.map((capsule) => (
          <div
            key={capsule._id as string}
            onClick={() => handleCapsuleClick(capsule._id as string)}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
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
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Images
                  </h3>
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
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Videos
                  </h3>
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
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    Audios
                  </h3>
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
          </div>
        ))
      ) : (
        <p className="text-white text-center text-lg">
          No time capsules available.
        </p>
      )}

      {/* Time Capsules Received */}
      <h2 className="text-2xl font-semibold text-white mb-6">Received</h2>
      {profile && profile.timeCapsulesReceived.length > 0 ? (
        profile.timeCapsulesReceived.map((capsule) => {
          const unlocked = isUnlocked(capsule.unlockDate);
          return (
            <div
              key={capsule._id as string}
              onClick={() => handleCapsuleClick(capsule._id as string)}
              className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8 cursor-pointer transform hover:scale-105 transition-transform duration-300 ${
                unlocked ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                {capsule.title}
              </h1>
              <p className="text-gray-700 text-center mb-8 text-lg">
                {capsule.description}
              </p>

              {/* Locked State */}
              {!unlocked ? (
                <div className="text-center text-red-500 text-xl">
                  This time capsule from {capsule.senderName} is locked until
                  {new Date(capsule.unlockDate).toLocaleDateString()}
                </div>
              ) : (
                <div>
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
                        <h3 className="text-lg font-bold text-gray-700 mb-2">
                          Images
                        </h3>
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
                        <h3 className="text-lg font-bold text-gray-700 mb-2">
                          Videos
                        </h3>
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
                        <h3 className="text-lg font-bold text-gray-700 mb-2">
                          Audios
                        </h3>
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
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-white text-center text-lg">
          No time capsules received.
        </p>
      )}
    </div>
  );
};

export default Profile;
