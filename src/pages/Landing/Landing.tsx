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
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Best Seller"
  },
  {
    title: "React Native for Beginners",
    instructor: "John Smith",
    rating: 4.8,
    reviews: 9876,
    price: "$39.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "New"
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated"
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated"
  },
  {
    title: "Mastering Python",
    instructor: "Alice Johnson",
    rating: 4.7,
    reviews: 5432,
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    badge: "Top Rated"
  },
];





import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Clock, Award, TrendingUp, PlayCircle, Play, Globe } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

function App() {
  const courses = [
    {
      title: "Complete Web Development Bootcamp 2024",
      instructor: "Sarah Johnson",
      rating: 4.8,
      reviews: 45892,
      price: 89.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
      students: "235,412"
    },
    {
      title: "Machine Learning A-Z: Hands-On Python",
      instructor: "David Chen",
      rating: 4.9,
      reviews: 32567,
      price: 94.99,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=600",
      students: "189,745"
    },
    {
      title: "Financial Analysis & Business Intelligence",
      instructor: "Michael Brown",
      rating: 4.7,
      reviews: 28934,
      price: 79.99,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      students: "156,289"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl mx-auto
            text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Learn without limits
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Start, switch, or advance your career with thousands of courses from expert instructors.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full px-6 py-4 rounded-lg pl-12 text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Learn with Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Play className="h-8 w-8" />,
                title: "Learn at Your Own Pace",
                description: "Enjoy lifetime access to courses on our website",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Flexible Learning",
                description: "Set your own schedule and learn on your terms",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Expert Instructors",
                description: "Learn from industry experts who care about your success",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="text-center hover:cursor-pointer hover:shadow-xl">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      

      {/* Trending Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending courses</h2>
              <p className="text-muted-foreground">Most popular courses among our students</p>
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
                  <h3 className="font-semibold text-xl mb-2">{course.title}</h3>
                  <p className="text-muted-foreground mb-2">{course.instructor}</p>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 font-bold mr-2">{course.rating}</span>
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
                    <span className="font-bold text-lg">${course.price}</span>
                  </div>
                  <Button className="w-full mt-4">Add to cart</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
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
                <CarouselItem key={course.title} className="sm:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full aspect-video object-cover"
                        />
                        {course.badge && (
                          <Badge className="absolute top-2 left-2">{course.badge}</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
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

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">EduConnect Business</h2>
              <p className="text-xl mb-8 opacity-90">
                Get unlimited access to 25,000+ of our top courses for your team
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
  );
}

export default App;

