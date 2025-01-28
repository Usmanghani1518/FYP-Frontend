import React from "react";
import Slider from "react-slick";

// Array to store card data
const instructors = [
  {
    name: "Mat Leonard",
    role: "Content Developer",
    image: "/mat.jpg",
    description:
      "Mat is a former physicist, research neuroscientist, and data scientist. He did his PhD and Postdoctoral Fellowship at the University of California, Berkeley.",
  },
  {
    name: "Robert Crocker",
    role: "Data Visualization Consultant at IBM",
    image: "/robert.jpg",
    description:
      "Robert is a Data Visualization consultant with over 7 years of experience leveraging Tableau. He provides solutions to clients all over the world.",
  },
  {
    name: "Ben Jones",
    role: "CEO of DataLiteracy.com",
    image: "/ben.jpg",
    description:
      "Ben is the founder & CEO of Data Literacy, LLC. He helps people learn the language of data and teaches data visualization theory at the University of Washington.",
  },
  {
    name: "Malavica Sridhar",
    role: "Senior Product Manager at CircleUp",
    image: "/malavica.jpg",
    description:
      "Malavica is a Senior Product Manager with over five years of experience. Her work includes building ML platforms used to identify breakout brands.",
  },
  {
    name: "Josh Bernhard",
    role: "Staff Data Scientist",
    image: "/josh.jpg",
    description:
      "Josh has been sharing his passion for data for over a decade. He's used data science for work ranging from cancer research to process automation.",
  },
  // Add more cards as needed
];

const InstructorSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Define border radius classes dynamically based on the index
  const getBorderClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return "rounded-tr-[40px]";
      case 1:
        return "rounded-br-[40px]";
      case 2:
        return "rounded-tl-[40px]";
      case 3:
        return "rounded-bl-[40px]";
      default:
        return "";
    }
  };

  return (
    <div className="py-8 bg-gray-100">
      <h2 className="text-center text-2xl font-bold mb-8">Taught By The Best</h2>
      <div className="container mx-auto">
        <Slider {...settings}>
          {instructors.map((instructor, index) => (
            <div key={index} className="px-4">
              <div
                className={`bg-blue-800 text-white p-6 ${getBorderClass(
                  index
                )} shadow-lg`}
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-center">
                  {instructor.name}
                </h3>
                <p className="text-sm text-center mb-4">{instructor.role}</p>
                <p className="text-sm">{instructor.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default InstructorSlider;
