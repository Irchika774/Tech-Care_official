import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import TechCareLogo from './TechCareLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 border-t border-white/10 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6 group">
              <div className="bg-white p-1.5 rounded-sm group-hover:bg-gray-200 transition-colors">
                <TechCareLogo variant="icon" className="h-5 w-5" color="#000" />
              </div>
              <h1 className="text-xl font-bold tracking-tighter uppercase">TechCare</h1>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Connecting customers with expert technicians for all tech repair needs. We provide high-quality repairs with professional care.
            </p>
          </div>

            {/* Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">SERVICES</h3>
              <ul className="space-y-4">
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('mobile-repair')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#mobile-repair';
                      }
                    }}
                  >
                    Mobile Repair
                  </a>
                </li>
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('pc-repair')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#pc-repair';
                      }
                    }}
                  >
                    PC Repair
                  </a>
                </li>
                <li>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" to="/services">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" to="/schedule">
                    Schedule Repair
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">SUPPORT</h3>
              <ul className="space-y-4">
                <li>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" to="/support">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" to="/support">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#terms';
                      }
                    }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#privacy';
                      }
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-6">COMPANY</h3>
              <ul className="space-y-4">
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer" 
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#about';
                      }
                    }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (window.location.pathname === '/') {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#features';
                      }
                    }}
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" to="/register">
                    Become a Technician
                  </Link>
                </li>
              </ul>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 space-y-6 md:space-y-0">
          <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase">
            © {currentYear} TECHCARE. ALL RIGHTS RESERVED.
            <span className="mx-2 opacity-30">|</span>
            <span className="opacity-70 italic lowercase">
              developed by{' '}
              <a
                href="https://github.com/Wenura17125"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                wenura
              </a>
            </span>
          </p>
          <div className="flex space-x-6">
            <a
              className="text-gray-400 hover:text-white transition-all hover:scale-110"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              className="text-gray-400 hover:text-white transition-all hover:scale-110"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              className="text-gray-400 hover:text-white transition-all hover:scale-110"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              className="text-gray-400 hover:text-white transition-all hover:scale-110"
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