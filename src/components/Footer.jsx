import { Wrench, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">TechCare</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting customers with expert technicians for all tech repair needs.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/mobile-repair">
                  Mobile Repair
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/pc-repair">
                  PC Repair
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/services">
                  All Services
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/schedule">
                  Schedule Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/support">
                  Help Center
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/support">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/company">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/company">
                  Our Team
                </Link>
              </li>
              <li>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to="/register">
                  Become a Technician
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} TechCare. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              className="text-muted-foreground hover:text-primary transition-colors"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              className="text-muted-foreground hover:text-primary transition-colors"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              className="text-muted-foreground hover:text-primary transition-colors"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              className="text-muted-foreground hover:text-primary transition-colors"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
