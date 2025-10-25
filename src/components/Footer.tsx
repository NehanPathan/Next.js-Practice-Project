"use client";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="p-4 md:p-6 bg-gray-100 shadow-inner mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center text-sm text-gray-600">
        <p className="mb-2 md:mb-0">
          © {new Date().getFullYear()} Mystery Message. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <Link
            href="https://github.com/NehanPathan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-black transition"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/nehan-khan-pathan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-600 transition"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
