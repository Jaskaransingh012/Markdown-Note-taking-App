"use client";
import "./markdown.css";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import { marked } from "marked";
import {
  GripVertical,
  FileSearch,
  Lock,
  AlertCircle,
  Home,
  ArrowLeft
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { documentApi } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { debounce } from "lodash";

// Error types
type ErrorType = 'not_found' | 'unauthorized' | 'server_error' | null;

export default function page() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState("");
  const { id } = useParams();
  const [documentFound, setDocumentFound] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  const isInitialLoad = useRef(true);

  // Update HTML when markdown changes
  useEffect(() => {
    if (markdown) {
      const parsedHtml = marked.parse(markdown) as string;
      setHtml(parsedHtml);
    }
  }, [markdown]);

  // Save document to API
  const saveDocument = useCallback(async (content: string) => {
    if (!user?._id || !id) return;

    try {
      setIsSaving(true);
      await documentApi.put(`/${id}`, {
        markdown: content,
        userId: user._id
      });
      setLastSaved(new Date().toLocaleTimeString());
      setError(null);
    } catch (error: any) {
      console.error("Failed to save document:", error);
      // Handle save errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('unauthorized');
      } else if (error.response?.status === 404) {
        setError('not_found');
      } else {
        setError('server_error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [user, id]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((content: string) => {
      saveDocument(content);
    }, 1000),
    [saveDocument]
  );

  // Handle markdown changes
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdown(newContent);
    debouncedSave(newContent);
  };

  // Fetch initial document
  const fetchDocument = async () => {
    if (!user?._id) {
      setIsLoading(false);
      setError('unauthorized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await documentApi.get(`/${id}/?userId=${user._id}`);
      const document = result.data.document;

      if (document) {
        setMarkdown(document?.markdown || "");
        setHtml(document?.html || "");
        setDocumentFound(true);
        setError(null);
      } else {
        setDocumentFound(false);
        setError('not_found');
      }
    } catch (error: any) {
      console.error("Failed to fetch document:", error);
      setDocumentFound(false);

      // Handle different error statuses
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('unauthorized');
      } else if (error.response?.status === 404) {
        setError('not_found');
      } else {
        setError('server_error');
      }
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [user, id]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Manual save with Ctrl+S or Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument(markdown);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markdown, saveDocument]);

  // Loading State
  if (isLoading) {
    return <LoadingState />;
  }

  // Error States
  if (error === 'not_found') {
    return <NotFoundError id={id as string} />;
  }

  if (error === 'unauthorized') {
    return <UnauthorizedError />;
  }

  if (error === 'server_error') {
    return <ServerError onRetry={fetchDocument} />;
  }

  // Main Editor
  return (
    <Group className="h-screen">
      {/* LEFT */}
      <Panel defaultSize={50} minSize={20}>
        <div className="h-screen overflow-y-auto flex flex-col bg-zinc-950">
          <div className="border-b border-zinc-800 px-4 py-3 font-semibold text-white flex justify-between items-center">
            <span>Markdown</span>
            <div className="flex items-center gap-3 text-sm font-normal">
              {isSaving && (
                <span className="text-yellow-500 animate-pulse">Saving...</span>
              )}
              {lastSaved && !isSaving && (
                <span className="text-green-500">✓ Saved at {lastSaved}</span>
              )}
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            spellCheck={false}
            className="
              flex-1
              resize-none
              bg-zinc-950
              text-white
              p-5
              outline-none
              font-mono
              text-[15px]
            "
            placeholder="Start writing your markdown here..."
          />
        </div>
      </Panel>

      {/* Divider */}
      <Separator>
        <CustomDivider />
      </Separator>

      {/* RIGHT */}
      <Panel defaultSize={50} minSize={20}>
        <div className="h-screen overflow-y-auto flex flex-col bg-white">
          <div className="border-b border-zinc-800 px-4 py-3 font-semibold text-black">
            HTML Preview
          </div>

          <div
            className="
              flex-1
              overflow-auto
              p-8
              prose
              prose-invert
              max-w-none
              markdown
            "
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </div>
      </Panel>
    </Group>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading document...</p>
      </div>
    </div>
  );
}

// Not Found Error Component
function NotFoundError({ id }: { id: string }) {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <FileSearch className="w-10 h-10 text-zinc-400" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Document Not Found
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              The document you're looking for doesn't exist or may have been deleted.
              <br />
              <span className="text-zinc-500 text-xs font-mono mt-1 block">
                Document ID: {id}
              </span>
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Unauthorized Error Component
function UnauthorizedError() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Access Denied
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              {user ? (
                "You don't have permission to view this document. Please contact the document owner for access."
              ) : (
                "Please sign in to access this document."
              )}
            </p>

            <div className="flex gap-3 w-full">
              {user ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Home className="w-4 h-4" />
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/signin')}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Server Error Component
function ServerError({ onRetry }: { onRetry: () => void }) {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-900/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-400" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              We're having trouble loading this document. Please try again or contact support if the problem persists.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={onRetry}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomDivider() {
  return (
    <div className="relative h-full w-3 cursor-ew-resize group flex items-center justify-center bg-zinc-900 hover:bg-blue-500 transition-colors duration-200">
      <GripVertical
        size={18}
        className="text-zinc-400 group-hover:text-white"
      />
    </div>
  );
}
