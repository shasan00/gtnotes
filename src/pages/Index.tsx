import React from "react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { useNotes } from "@/hooks/useNotes";
import Sidebar from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { notes, loading, error, refreshNotes } = useNotes();

  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full max-w-sm">
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-screen-2xl">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading notes: {error}</p>
            <button 
              onClick={refreshNotes}
              className="px-4 py-2 bg-gt-gold text-white rounded hover:bg-gt-gold/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-2xl">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No notes available yet.</p>
            <p className="text-sm text-gray-500">Be the first to upload some notes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {notes.map((note) => (
              <NoteCard 
                key={note.id} 
                id={note.id}
                title={note.title}
                description={note.description}
                course={note.course}
                professor={note.professor}
                semester={note.semester}
                status={note.status}
                fileName={note.fileName}
                createdAt={note.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;