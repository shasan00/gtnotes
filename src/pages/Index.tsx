import React from "react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { mockNotes } from "../data/mockNotes.ts";
import Sidebar from "@/components/Sidebar"

const Index = () => {
  return (
    <Layout>
      <div className="max-w-screen-2xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          
          {mockNotes.map((note) => (
            <NoteCard key={note.id} {...note} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;