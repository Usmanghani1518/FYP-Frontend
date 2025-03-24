"use client";

import { Button } from "@/components/ui/button";

// import React from "react";

export const  Footer =()=> {
  return (
    <footer className="bg-gray-100 backdrop-blur border-t py-10 text-gray-700 footer ">
      <div className="container mx-auto px-6 lg:px-16 relative">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <img
            src="/imagies/Logo.png" // Replace with your logo path
            alt="EduConnect"
            className="w-32"
          />
          <p className="text-xs text-gray-500 md:text-right">
            © 2011-2025 EduConnect, Inc. "Nanodegree" is a registered trademark of
            EduConnect.
          </p>
        </div>

        {/* Links Section */}
        <div className="mt-10 grid grid-cols-2 gap-8 text-sm md:grid-cols-5">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-base text-gray-200">Company</h3>
            <ul className="mt-2 space-y-2 text-gray-400 leading-7 ">
              <li className="hover:cursor-pointer hover:text-purple-500"><a href="#about"></a>About Us</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Why EduConnect?</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Blog</li>
              <li className="hover:cursor-pointer hover:text-purple-500">In the News</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Jobs at EduConnect</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Become a Mentor</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Partner with EduConnect</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold  text-gray-200">EduConnect Schools</h3>
            <ul className="mt-2 space-y-2 text-gray-400 leading-7">
              <li className="hover:cursor-pointer hover:text-purple-500">School of Artificial Intelligence</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Autonomous Systems</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Business</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Cloud Computing</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Cybersecurity</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Data Science</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Executive Leadership</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Product Management</li>
              <li className="hover:cursor-pointer hover:text-purple-500">School of Programming</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-base text-gray-200">Featured Programs</h3>
            <ul className="mt-2 space-y-2 text-gray-400 leading-7">
              <li className="hover:cursor-pointer hover:text-purple-500">Business Analytics</li>
              <li className="hover:cursor-pointer hover:text-purple-500">SQL</li>
              <li className="hover:cursor-pointer hover:text-purple-500">AWS Cloud Architect</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Data Analyst</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Intro to Programming</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Digital Marketing</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Self-Driving Car Engineer</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold text-base text-gray-200">Only at EduConnect</h3>
            <ul className="mt-2 space-y-2 text-gray-400 leading-7 ">
              <li className="hover:cursor-pointer hover:text-purple-500">Artificial Intelligence</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Deep Learning</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Digital Marketing</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Flying Car and Autonomous Flight Engineer</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Intro to Self-Driving Cars</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Machine Learning Engineer</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Robotics Software Engineer</li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-semibold text-base text-gray-300">Resources</h3>
            <ul className="mt-2 space-y-2 text-gray-400 leading-7">
              <li className="hover:cursor-pointer hover:text-purple-500">Catalog</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Career Outcomes</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Help and FAQ</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Scholarships</li>
              <li className="hover:cursor-pointer hover:text-purple-500">Resource Center</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400">Submit your email to stay updated on the latest in technology</p>
            <div className="mt-4 flex sm:flex-row flex-col  items-center  gap-y-2 sm:gap-y-0 gap-x-2">
              <input
                type="email"
                placeholder="Email Address"
                className="rounded-md border w-full sm:w-auto px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom_primary"
              />
              <Button className="rounded-md w-full sm:w-auto  px-4 py-4 text-white ">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
          <div className="flex space-x-6 text-gray-500">
            <a href="#" className="hover:text-gray-800">
              Legal & Privacy
            </a>
            <a href="#" className="hover:text-gray-800">
              Site Map
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-6 flex justify-center space-x-4">
          <a href="#" className="text-gray-500 hover:text-blue-600">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
