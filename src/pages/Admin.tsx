import React from "react";
import Layout from "@/components/Layout";
import { NotesService, Note } from "@/services/notesService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/utils/toast";

export default function Admin() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actioningId, setActioningId] = React.useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotesService.getPendingNotes();
      setNotes(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load pending notes");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActioningId(id);
      const result = await NotesService.approveNote(id);
      if (result) {
        showSuccess("Note approved");
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (e: any) {
      showError(e?.message || "Failed to approve note");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActioningId(id);
      const result = await NotesService.rejectNote(id);
      if (result) {
        showSuccess("Note rejected");
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (e: any) {
      showError(e?.message || "Failed to reject note");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin: Pending Notes</h1>
          <Button variant="outline" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : notes.length === 0 ? (
          <div className="text-gray-600">No pending notes.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle className="truncate">{note.title}</CardTitle>
                  <CardDescription>
                    {note.course} • {note.professor} • {note.semester}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 mb-4 text-sm text-muted-foreground">
                    {note.description || "No description"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(note.id)}
                      disabled={actioningId === note.id}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(note.id)}
                      disabled={actioningId === note.id}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}


