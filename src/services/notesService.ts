export interface Note {
  id: string;
  title: string;
  course: string;
  classCode?: string; // Added to match the API response
  professor: string;
  semester: string;
  description?: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileKey: string;     // Added to match the API response
  fileUrl?: string;     // Added for the generated URL
  status: 'pending' | 'approved' | 'rejected';
  uploadedBy: string;
  approvedBy?: string | null;
  type?: string;        // Added to match the UI
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  note: Note;
}

export interface NotesResponse {
  notes: Note[];
}

export class NotesService {
  static async getNotes(): Promise<Note[]> {
    try {
      const response = await fetch('/api/notes', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data: NotesResponse = await response.json();
      return data.notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async getApprovedNotes(): Promise<Note[]> {
    try {
      const notes = await this.getNotes();
      return notes.filter(note => note.status === 'approved');
    } catch (error) {
      console.error('Error fetching approved notes:', error);
      return [];
    }
  }

  static async getNotesByUser(): Promise<Note[]> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/notes/my-notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user notes');
      }

      const data: NotesResponse = await response.json();
      return data.notes;
    } catch (error) {
      console.error('Error fetching user notes:', error);
      return [];
    }
  }

  static async getNoteById(id: string): Promise<NoteResponse | null> {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch note');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  }
}
