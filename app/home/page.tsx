"use client";

import DocumentCard from "@/components/DocumentCard";
import { SidebarDemo } from "@/components/SideBarDemo";
import { documentApi } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { DocumentSchema } from "@/schemas/DocumentSchema";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@base-ui/react";
import { SearchCheckIcon, SearchIcon, Settings2Icon, PlusIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";


function Page() {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<DocumentSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state (bonus)
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocuments = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await documentApi.get(`/?userId=${user._id}`);
      console.log("response in fetchDocuments", response)
      setDocuments(response.data.documents);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Could not load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDocuments();
    }
  }, [user]);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: newTitle.trim(),
        content: newContent.trim(),
        userId: user?._id,
      };
      const response = await documentApi.post("/create", payload);

      console.log("response",response);
      // Add the new document to the list optimistically
      setDocuments((prev) => [response.data.document, ...prev]);
      // Reset form and close modal
      setNewTitle("");
      setNewContent("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create document:", err);
      alert("Failed to create document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ✅ Correct – only one declaration
const filteredDocuments = documents.filter((doc) =>
  doc.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <SidebarDemo />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
              My Documents
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
              >
                <PlusIcon className="h-4 w-4" />
                New Document
              </button>
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <SearchIcon className="h-5 w-5 cursor-pointer hover:text-neutral-700" />
                <Settings2Icon className="h-5 w-5 cursor-pointer hover:text-neutral-700" />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        <hr className="my-6 border-neutral-200 dark:border-neutral-700" />

        {/* Document Grid */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
            <p className="text-neutral-500 dark:text-neutral-400">
              {searchQuery ? "No documents match your search." : "You haven't created any documents yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-sm font-medium text-indigo-600 hover:underline"
              >
                Create your first document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc._id?.toString()} document={doc} />
            ))}
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                New Document
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDocument} className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  placeholder="Document title"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-neutral-900"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
