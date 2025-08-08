import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Layout from '@/components/Layout';
import { mockNotes } from '../data/mockNotes.ts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, User, CalendarDays, ArrowLeft } from 'lucide-react';

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const note = mockNotes.find(n => n.id === parseInt(id || ''));

  if (!note) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Note not found</h1>
          <Button asChild variant="link" className="mt-4">
            <RouterLink to="/">Go back to Home</RouterLink>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-4">
          <RouterLink to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Notes
          </RouterLink>
        </Button>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-primary">{note.title}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">{note.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-gt-gold/10 text-gt-gold whitespace-nowrap">{note.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center text-lg">
              <BookOpen className="h-5 w-5 mr-3 text-muted-foreground" />
              <span className="font-semibold mr-2">Class:</span>
              <span>{note.classCode}</span>
            </div>
            <div className="flex items-center text-lg">
              <User className="h-5 w-5 mr-3 text-muted-foreground" />
              <span className="font-semibold mr-2">Professor:</span>
              <span>{note.professor}</span>
            </div>
            <div className="flex items-center text-lg">
              <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
              <span className="font-semibold mr-2">Semester:</span>
              <span>{note.semester}</span>
            </div>
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Note Content</h3>
              <div className="p-8 border rounded-md bg-muted/40">
                <p className="text-muted-foreground text-center">
                  [Placeholder for the actual note content, e.g., a PDF viewer or markdown renderer.]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NoteDetail;