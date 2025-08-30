"use client";
import { useSearchParams } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import FeedGrid from "../components/FeedGrid";
import ProjectSearch from "../components/ProjectSearch";

export default function FeedsPage() {
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();

  // Extract URL parameters for filtering
  const urlFilters = {
    techTags: searchParams.getAll("tech_tag"),
    domainTags: searchParams.getAll("domain_tag"),
    search: searchParams.get("search") || "",
    fromDate: searchParams.get("from_date") || "",
    toDate: searchParams.get("to_date") || "",
    status: searchParams.getAll("status"),
    sort: searchParams.get("sort") || "trending",
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } font-space-mono`}
    >
      <div className={`max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-20`}>
        <FeedGrid showSearch={true} urlFilters={urlFilters} />
      </div>
    </div>
  );
}
