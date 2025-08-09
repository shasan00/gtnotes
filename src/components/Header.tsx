import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gt-white text-gt-gold-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold text-gt-gold hover:text-gt-gold/90">
          GT Notes
        </Link>
        <div className="relative flex-1 max-w-md mx-4">
          <Input
            type="text"
            placeholder="Search notes, professors, classes..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input focus:ring-gt-gold focus:border-gt-gold"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gt-gold hover:bg-gt-gold/10 hover:text-gt-gold">Upload</Button>
          <Button className="bg-gt-gold text-gt-gold-foreground hover:bg-gt-gold/90"><Link to="sign-in">Sign In</Link></Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;