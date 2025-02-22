// import React from 'react'
// import InstructorSlider from './Slider'

// const Landing = () => {
//   return (
//     <div>
//       <InstructorSlider/>
//     </div>
//   )
// }

// export default Landing

const featuredCourses = [
  {
    title: "Advanced JavaScript Concepts",
    instructor: "Jane Doe",
    rating: 4.9,
    reviews: 12345,
    price: "$49.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller",
  },
  {
    title: "React Native for Beginners",
    instructor: "John Smith",
    rating: 4.8,
    reviews: 9876,
    price: "$39.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "New",
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated",
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated",
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated",
  },
];

const slides = [
  {
    title: "Learning that gets you",
    description:
      "Skills for your present (and your future). Get started with us.",
    image: "/public/imagies/land/heroCarousel1.jpg",
  },
  {
    title: "Unlock your potential",
    description: "Learn the skills you need to succeed in your career.",
    image: "/public/imagies/land/heroCarousel2.jpg",
  },
];

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Award, TrendingUp, Play, Globe } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IoTrophyOutline } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { FaRegSmile, FaUsers, FaRegClipboard } from "react-icons/fa";
import { useEffect, useState } from "react";

function App() {
  const courses = [
    {
      title: "Complete Web Development Bootcamp 2024",
      instructor: "Sarah Johnson",
      rating: 4.8,
      reviews: 45892,
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
      students: "235,412",
    },
    {
      title: "Machine Learning A-Z: Hands-On Python",
      instructor: "David Chen",
      rating: 4.9,
      reviews: 32567,
      price: 94.99,
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600",
      students: "189,745",
    },
    {
      title: "Financial Analysis & Business Intelligence",
      instructor: "Michael Brown",
      rating: 4.7,
      reviews: 28934,
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      students: "156,289",
    },
  ];

  const stats = [
    {
      icon: <FaRegSmile className="icon" />,
      value: "5,248",
      label: "HAPPY STUDENTS",
    },
    {
      icon: <FaRegClipboard className="icon" />,
      value: "675",
      label: "OUR COURSES",
    },
    { icon: <FaUsers className="icon" />, value: "248", label: "OUR TEACHERS" },
    {
      icon: <IoTrophyOutline className="icon" />,
      value: "24",
      label: "AWARDS WON",
    },
  ];

  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.next();
    }, 2000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}

      <div className="relative">
        {/* <div>
        <Carousel
          className="w-full max-w-7xl mx-auto"
          setApi={setApi}
          onSelect={(index) => setCurrent(index)}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] w-full mt-5 overflow-hidden bg-gray-300 ">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    // fill
                    className="object-cover"
                    // priority={index === 0}
                  />
                  <div className="absolute inset-0 ">
                    <Card className="absolute left-8 top-1/2 w-full max-w-lg -translate-y-1/2 border-none bg-transparent shadow-none lg:left-16">
                      <CardContent className="space-y-4 p-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 lg:text-5xl">
                          {slide.title}
                        </h1>
                        <p className="text bg-gray-300 px-3 py-2 opacity-70 rounded-sm font-semibold text-gray-900">
                          {slide.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 hidden sm:flex" />
          <CarouselNext className="right-4 hidden sm:flex" />
        </Carousel>
        </div> */}
        <section className="relative bg-cover bg-center bg-no-repeat py-20 px-6 md:px-12">
        <video 
    className="absolute top-0 left-0 w-full h-full object-cover" 
    autoPlay 
    loop 
    muted 
    playsInline
  >
    <source src="public/imagies/Land/earth.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    {/* Left Content */}
    <div className="text-white">
      <p className="uppercase tracking-wide text-purple-500 text-sm">Welcome to EduConnect</p>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
        We are determined to <br /> achieve the highest <br /> standards
      </h1>
      <p className="text-gray-300 mt-4 max-w-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <button className="mt-6 bg-custom_primary hover:bg-custom_primary_hover text-white font-semibold py-3 px-6 rounded-lg shadow-lg">
        Take a Tour
      </button>
    </div>

    <div className="relative">
      <img src="/students-image.png" alt="Students" className="w-full h-auto object-cover" />
    </div>
  </div>

  <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-white border-t border-gray-600 pt-8">
    {[
      { icon: "🎓", title: "Student", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { icon: "👨‍🏫", title: "Teachers", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { icon: "🏫", title: "Classroom", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
    ].map((item, index) => (
      <div key={index} className="flex items-start bg-white/10 backdrop-blur-sm px-2 py-12  rounded-md space-x-4">
        <div className="text-4xl">{item.icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-gray-300 text-sm">{item.text}</p>
        </div>
      </div>
    ))}
  </div>
</section>

        <div className="relative bg-slate-100">
          
{/* ------------------------------why learn with us -------------------------------*/}

          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold font-josefin uppercase  ">
                Why Learn with Us
              </h2>
              <hr className="text-custom_primary p-[1.5px] rounded-sm bg-custom_primary mt-2 mb-12 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Play className="h-8 w-8" />,
                    title: "Learn at Your Own Pace",
                    description:
                      "Enjoy lifetime access to courses on our website",
                  },
                  {
                    icon: <Clock className="h-8 w-8" />,
                    title: "Flexible Learning",
                    description:
                      "Set your own schedule and learn on your terms",
                  },
                  {
                    icon: <Award className="h-8 w-8" />,
                    title: "Expert Instructors",
                    description:
                      "Learn from industry experts who care about your success",
                  },
                ].map((benefit) => (
                  <Card
                    key={benefit.title}
                    className="text-center hover:cursor-pointer hover:shadow-xl"
                  >
                    <CardContent className="pt-6">
                      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/*--------------------------- Trending Courses Section -----------------------------*/}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold font-josefin capitalize mb-2">
                    Trending courses
                  </h2>
                  <p className="text-muted-foreground">
                    Most popular courses among our students
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <Card key={index} className="overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {course.instructor}
                      </p>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 font-bold mr-2">
                          {course.rating}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(course.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground ml-2">
                          ({course.reviews.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {course.students} students
                        </span>
                        <span className="font-bold text-lg">
                          ${course.price}
                        </span>
                      </div>
                      <Button className="w-full mt-4">Add to cart</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
{/* ------------------------------Stats -------------------------------*/}

          <section className="bg-[#1e2540] py-12">
            <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-custom_red text-7xl mb-2">
                      {stat.icon}
                    </div>

                    <h2 className="text-3xl font-bold mb-4">{stat.value}</h2>

                    <p className="text-sm uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
{/* ------------------------------Featured coureses -------------------------------*/}
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold font-josefin uppercase">
                  Featured Courses
                </h2>
                <Button variant="outline">View all</Button>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredCourses.map((course) => (
                    <CarouselItem
                      key={course.title}
                      className="sm:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="h-full">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full aspect-video object-cover"
                            />
                            {course.badge && (
                              <Badge className="absolute top-2 left-2">
                                {course.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold mb-2 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {course.instructor}
                            </p>
                            <div className="flex items-center gap-1 mb-2">
                              <span className="font-bold">{course.rating}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(course.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({course.reviews.toLocaleString()})
                              </span>
                            </div>
                            <p className="font-bold">{course.price}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* <CarouselPrevious /> */}
                {/* <CarouselNext /> */}
              </Carousel>
            </div>
          </section>
{/* --------------------- Educonnect business --------------------*/}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 font-josefin capitalize">
                    EduConnect Business
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Get unlimited access to 25,000+ of our top courses for your
                    team
                  </p>
                  <div className="space-y-4">
                    {[
                      "Access to top courses for teams",
                      "Learning engagement tools",
                      "Enterprise-grade security",
                      "Advanced reporting and analytics",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="lg" variant="secondary" className="mt-8">
                    Get Started
                  </Button>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                    alt="Business Team"
                    className="rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default App;
