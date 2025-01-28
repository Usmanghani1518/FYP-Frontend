"use client";

// import React from "react";

export const  Footer =()=> {
  return (
    <footer className="bg-white border-t py-10 text-gray-700">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <img
            src="/logo.svg" // Replace with your logo path
            alt="Udacity"
            className="h-8"
          />
          <p className="text-xs text-gray-500 md:text-right">
            © 2011-2025 Udacity, Inc. "Nanodegree" is a registered trademark of
            Udacity.
          </p>
        </div>

        {/* Links Section */}
        <div className="mt-10 grid grid-cols-2 gap-8 text-sm md:grid-cols-5">
          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-gray-800">Company</h3>
            <ul className="mt-2 space-y-2">
              <li>About Us</li>
              <li>Why Udacity?</li>
              <li>Blog</li>
              <li>In the News</li>
              <li>Jobs at Udacity</li>
              <li>Become a Mentor</li>
              <li>Partner with Udacity</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-gray-800">Udacity Schools</h3>
            <ul className="mt-2 space-y-2">
              <li>School of Artificial Intelligence</li>
              <li>School of Autonomous Systems</li>
              <li>School of Business</li>
              <li>School of Cloud Computing</li>
              <li>School of Cybersecurity</li>
              <li>School of Data Science</li>
              <li>School of Executive Leadership</li>
              <li>School of Product Management</li>
              <li>School of Programming</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-gray-800">Featured Programs</h3>
            <ul className="mt-2 space-y-2">
              <li>Business Analytics</li>
              <li>SQL</li>
              <li>AWS Cloud Architect</li>
              <li>Data Analyst</li>
              <li>Intro to Programming</li>
              <li>Digital Marketing</li>
              <li>Self-Driving Car Engineer</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-semibold text-gray-800">Only at Udacity</h3>
            <ul className="mt-2 space-y-2">
              <li>Artificial Intelligence</li>
              <li>Deep Learning</li>
              <li>Digital Marketing</li>
              <li>Flying Car and Autonomous Flight Engineer</li>
              <li>Intro to Self-Driving Cars</li>
              <li>Machine Learning Engineer</li>
              <li>Robotics Software Engineer</li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-semibold text-gray-800">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>Catalog</li>
              <li>Career Outcomes</li>
              <li>Help and FAQ</li>
              <li>Scholarships</li>
              <li>Resource Center</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="text-center md:text-left">
            <p>Submit your email to stay updated on the latest in technology</p>
            <div className="mt-4 flex items-center space-x-4">
              <input
                type="email"
                placeholder="Email Address"
                className="rounded-md border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Subscribe to Newsletter
              </button>
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
