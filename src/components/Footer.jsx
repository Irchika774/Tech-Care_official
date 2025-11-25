import { Wrench, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">TechCare</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2024 TechCare. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link className="text-muted-foreground hover:text-primary transition-colors" to="/">
            Services
          </Link>
          <Link className="text-muted-foreground hover:text-primary transition-colors" to="/contact">
            Support
          </Link>
          <Link className="text-muted-foreground hover:text-primary transition-colors" to="/about">
            Company
          </Link>
        </div>
        <div className="flex space-x-4">
          <a className="text-muted-foreground hover:text-primary transition-colors" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="h-6 w-6" />
          </a>
          <a className="text-muted-foreground hover:text-primary transition-colors" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
