"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-hot-toast";
import FeedCard, { FeedProject } from "./FeedCard";
import ProjectSearch from "./ProjectSearch";

export default function FeedGrid({
  showSearch = false,
  urlFilters = {},
}: {
  showSearch?: boolean;
  urlFilters?: {
    techTags?: string[];
    domainTags?: string[];
    search?: string;
    fromDate?: string;
    toDate?: string;
    status?: string[];
    sort?: string;
  };
}) {
  const { user } = useUser();
  const { userInfo } = useUserContext();
  const [projects, setProjects] = useState<FeedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<FeedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // Update projects when they're loaded
  useEffect(() => {
    if (projects.length > 0) {
      setFilteredProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?status=APPROVED");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Sort projects by startDate (newest first)
        const sortedProjects = [...data].sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
        });

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleLike = async (
    e: React.MouseEvent,
    projectId: string,
    isLiked: boolean
  ) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to like projects");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setProjects(
          projects.map((project) => {
            if (project.id === projectId) {
              return {
                ...project,
                likes: isLiked
                  ? project.likes.filter(
                      (like) => like.hackerId !== userInfo?.id
                    )
                  : [
                      ...project.likes,
                      {
                        hackerId: userInfo?.id || "",
                        createdAt: new Date().toISOString(),
                      },
                    ],
              };
            }
            return project;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like project");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
            isDarkMode ? "border-purple-400" : "border-indigo-600"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-6">
          <ProjectSearch
            projects={projects}
            onFilteredProjectsChange={setFilteredProjects}
            urlFilters={urlFilters}
            disableUrlUpdate={true}
          />
        </div>
      )}

      {/* Vertical Scrollable Feed */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <FeedCard
            key={project.id}
            project={project}
            userInfo={userInfo}
            handleLike={handleLike}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* No projects message */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No projects found
          </p>
        </div>
      )}
    </div>
  );
}
