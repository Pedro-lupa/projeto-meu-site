import React from 'react';
import { Instagram, Github, Linkedin } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; 2025 Geek's Journey - Desenvolvido por Pedro Lima</p>
        <div className="footer-socials">
          <a href="https://instagram.com/pedro_jpln" target="_blank" rel="noreferrer"><Instagram size={20} /></a>
          <a href="https://github.com/Pedro-lupa" target="_blank" rel="noreferrer"><Github size={20} /></a>
          <a href="#" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;