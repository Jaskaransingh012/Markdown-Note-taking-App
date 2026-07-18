"use client"
import { DocumentSchema } from "@/schemas/DocumentSchema";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";


interface DocumentCardProps {
  document: DocumentSchema;
  className?: string;
}

export default function DocumentCard({ document, className }: DocumentCardProps) {

  const router = useRouter();
  // Format date if available
  const formattedDate = document.createdAt
    ? new Date(document.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  // Truncate content for preview
  const preview = "";

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-indigo-700",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-1">
          {document.title || "Untitled"}
        </h3>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          {"General"}
        </span>
      </div>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
        {preview || "No content"}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>
        <button
          className="text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400"
          onClick={() => {
            // You can add view/edit logic here, e.g., navigate to /documents/:id

            console.log("View document", document._id);
            router.push(`/documents/${document._id}`)
          }}
        >
          View →
        </button>
      </div>
    </div>
  );
}
