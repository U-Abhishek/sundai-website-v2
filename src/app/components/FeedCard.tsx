"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  CodeBracketIcon,
  PlayIcon,
  EyeIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { swapFirstLetters } from "../utils/nameUtils";
import ShareModal from "./ShareModal";

export type FeedProject = {
  id: string;
  title: string;
  status: "DRAFT" | "PENDING" | "APPROVED";
  preview: string;
  description: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  blogUrl?: string | null;
  techTags: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
  domainTags: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
  is_starred: boolean;
  is_broken: boolean;
  thumbnail?: {
    url: string;
  } | null;
  launchLead: {
    id: string;
    name: string;
    twitterUrl?: string | null;
    linkedinUrl?: string | null;
    avatar?: {
      url: string;
    } | null;
  };
  participants: Array<{
    role: string;
    hacker: {
      id: string;
      name: string;
      bio?: string | null;
      twitterUrl?: string | null;
      linkedinUrl?: string | null;
      avatar?: {
        url: string;
      } | null;
    };
  }>;
  startDate: Date;
  endDate?: Date | null;
  likes: Array<{
    hackerId: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

function FeedCard({
  project,
  userInfo,
  handleLike,
  isDarkMode,
}: {
  project: FeedProject;
  userInfo: any;
  handleLike: (
    e: React.MouseEvent,
    projectId: string,
    isLiked: boolean
  ) => void;
  isDarkMode: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  return (
         <div
       className={`${
         isDarkMode
           ? "bg-gray-800 hover:bg-gray-750 border-gray-700"
           : "bg-white hover:bg-gray-50 border-gray-200"
       } rounded-xl border transition-all duration-200 px-6 py-4 max-w-5xl mx-auto`}
     >
      {/* Header with Title, Team Avatars, and Like Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Team Avatars */}
          <div className="flex -space-x-7">
            {/* Launch Lead - Front */}
            <div className="relative z-20">
              {project.launchLead.avatar ? (
                <Image
                  src={project.launchLead.avatar.url}
                  alt={project.launchLead.name}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-gray-800"
                />
              ) : (
                <div
                  className={`w-9 h-9 ${
                    isDarkMode ? "bg-purple-900" : "bg-indigo-100"
                  } rounded-full flex items-center justify-center border-2 border-gray-800`}
                >
                  <span
                    className={`${
                      isDarkMode ? "text-purple-400" : "text-indigo-600"
                    } text-sm`}
                  >
                    {project.launchLead.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Other participants - Behind with same size */}
            {project.participants.slice(0, 2).map((participant, index) => (
              <div
                key={participant.hacker.id}
                className={`relative ${index === 0 ? "z-10" : "z-0"}`}
              >
                {participant.hacker.avatar ? (
                  <Image
                    src={participant.hacker.avatar.url}
                    alt={swapFirstLetters(participant.hacker.name)}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-gray-800"
                  />
                ) : (
                  <div
                    className={`w-9 h-9 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    } rounded-full flex items-center justify-center border-2 border-gray-800`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } text-sm`}
                    >
                      {swapFirstLetters(participant.hacker.name)[0]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <Link href={`/projects/${project.id}`}>
              <h3
                className={`text-xl font-bold mb-1 ${
                  isDarkMode
                    ? "text-gray-100 hover:text-purple-400"
                    : "text-gray-900 hover:text-indigo-600"
                } transition-colors`}
              >
                {project.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-2">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-1">
                {project.techTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      isDarkMode
                        ? "bg-purple-900/30 text-purple-300"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {tag.name}
                  </span>
                ))}
                {project.techTags.length > 3 && (
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    +{project.techTags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            handleLike(
              e,
              project.id,
              project.likes.some((like) => like.hackerId === userInfo?.id)
            );
          }}
          className="p-3 flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          aria-label={`Like project ${project.title}`}
        >
          {project.likes.some((like) => like.hackerId === userInfo?.id) ? (
            <HeartIconSolid className="h-8 w-8 text-indigo-600" />
          ) : (
            <HeartIcon className="h-8 w-8" />
          )}
          <span className="text-base font-medium">{project.likes.length}</span>
        </button>
      </div>

      {/* Description Text */}
      <div className="mb-3">
        <div
          className={`text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {isExpanded ? (
            <>
              {project.description}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(false);
                }}
                className={`ml-1 font-medium ${
                  isDarkMode
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-indigo-600 hover:text-indigo-800"
                } transition-colors`}
              >
                show less
              </button>
            </>
          ) : (
            <>
              {project.description.slice(0, 220)}
              {project.description.length > 220 && (
                <>
                  <span>...</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsExpanded(true);
                    }}
                    className={`ml-1 font-medium ${
                      isDarkMode
                        ? "text-purple-400 hover:text-purple-300"
                        : "text-indigo-600 hover:text-indigo-800"
                    } transition-colors`}
                  >
                    more
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Large Thumbnail Image */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
        <Image
          src={
            project.thumbnail?.url ||
            (isDarkMode
              ? "/images/default_project_thumbnail_dark.svg"
              : "/images/default_project_thumbnail_light.svg")
          }
          alt={project.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-3 pt-0">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            target="_blank"
          >
            <CodeBracketIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
        )}

        {project.demoUrl && (
          <Link
            href={project.demoUrl}
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isDarkMode
                ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
            }`}
            target="_blank"
          >
            <PlayIcon className="h-4 w-4" />
            <span>Demo</span>
          </Link>
        )}

        <Link
          href={`/projects/${project.id}`}
          className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <EyeIcon className="h-4 w-4" />
          <span>Details</span>
        </Link>

        <button
          onClick={() => setShowShareModal(true)}
          className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <ShareIcon className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        showModal={showShareModal}
        setShowModal={setShowShareModal}
        project={project}
        userInfo={userInfo}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default FeedCard;
