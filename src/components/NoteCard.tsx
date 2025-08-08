import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, BookOpen, CalendarDays, User } from "lucide-react";

interface NoteCardProps {
  id: number;
  title: string;
  description: string;
  classCode: string;
  professor: string;
  semester: string;
  type: "Notes" | "Exam" | "Homework";
}

const NoteCard: React.FC<NoteCardProps> = ({ id, title, description, classCode, professor, semester, type }) => {
  const typeIcon = {
    Notes: <BookOpen className="h-4 w-4 mr-2" />,
    Exam: <FileText className="h-4 w-4 mr-2" />,
    Homework: <FileText className="h-4 w-4 mr-2" />,
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary h-14">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-10">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <div className="flex items-center text-gt-gold">
          {typeIcon[type]}
          <span className="font-medium">{type}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{classCode}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{professor}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{semester}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to={`/notes/${id}`}
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "w-full justify-center py-2 bg-gt-gold/10 text-gt-gold hover:bg-gt-gold/20 cursor-pointer"
          )}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;