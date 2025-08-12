import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card text-foreground shadow-sm">
      <div className="flex h-16 items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-gt-gold hover:text-gt-gold/90 flex-shrink-0">
          GT Notes
        </Link>
        <div className="relative flex-1 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search notes, professors, classes..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input focus:ring-gt-gold focus:border-gt-gold bg-background"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <nav className="flex items-center space-x-4 flex-shrink-0">
          <Button asChild variant="ghost" className="text-gt-gold hover:bg-gt-gold/10 hover:text-gt-gold">
            <Link to="/upload">Upload</Link>
          </Button>
          <ThemeToggle />
          <AuthButtons />
        </nav>
      </div>
    </header>
  );
};

export default Header;

function AuthButtons() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthed(true);
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "===".slice((base64.length + 3) % 4);
        const payload = JSON.parse(atob(padded));
        setIsAdmin(payload?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAuthed(false);
      setIsAdmin(false);
    }
  }, []);

  if (isAuthed) {
return (
  <div className="flex items-center space-x-2">
    {isAdmin && (
      <Button
        asChild
        className="bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Link to="/admin">Admin</Link>
      </Button>
    )}
    <Button
      asChild
      className="bg-gt-gold text-gt-gold-foreground hover:bg-gt-gold/90"
    >
      <Link to="/profile">Profile</Link>
    </Button>
  </div>
);
}
return (
  <Button className="bg-gt-gold text-gt-gold-foreground hover:bg-gt-gold/90">
    <Link to="/sign-in">Sign In</Link>
  </Button>
);
}
