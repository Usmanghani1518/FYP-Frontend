
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Award, TrendingUp, Play, Globe } from "lucide-react";
import { IoTrophyOutline } from "react-icons/io5";
import { FaRegSmile, FaUsers, FaRegClipboard } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { backendRequest } from "@/Helper/backendRequest";
import { useCart } from "@/redux/app.hooks";
import { Course } from "@/redux/slices/cart.slice";

interface Response {
  success: boolean;
  data: Course[];
  message?: string;
}
function App() {
 
  const [courses, setCourses] = useState<Course[]>([])
  const { addToCart, isInCart } = useCart();
  
  const fetchCourse = async () => { 
    try {
      const response = await backendRequest<Response>("GET","/course/trending")
      if (response.success){
        setCourses(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(() => { 
    fetchCourse()
  }
  ,[])

  const [api, setApi] = useState(null);


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
  Empowering Minds, <br /> Shaping the Future <br /> with Knowledge  
</h1>
<p className="text-gray-300 mt-4 max-w-lg">
  Unlock your potential with world-class education and hands-on learning experiences.
</p>
      <button className="mt-6 bg-custom_primary hover:bg-custom_primary_hover text-white font-semibold py-3 px-6 rounded-lg shadow-lg">
        Take a Tour
      </button>
    </div>

    <div className="relative">
      <img src="/imagies/Land/students.png" alt="Students" className="w-full h-96   rounded-lg object-cover" />
    </div>
  </div>

  <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-white border-t border-gray-600 pt-8">
    {[
     { icon: "🎓", title: "Student", text: "Empowering students with quality education and resources." },
     { icon: "👨‍🏫", title: "Teachers", text: "Providing educators with the best tools to inspire learning." },
     { icon: "📚", title: "Courses", text: "Explore a variety of courses designed to help you succeed." }
     
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

        <div className="relative bg-purple-100">
          
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
          <section className="bg-purple-950  py-12">
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
          {/*--------------------------- Trending Courses Section -----------------------------*/}
          <section className="py-20 bg-gray-100">
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
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {course.teacher.name}
                      </p>
                      <div className="flex items-center mb-2">
                       {course.averageRating > 0   && <span className="text-yellow-500 font-bold mr-2">
                          { course.averageRating}
                        </span>}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(course.averageRating?course.averageRating :0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground ml-2">
                          {/* ({course.reviews.toLocaleString()}) */}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {course.students? course.students.toLocaleString():0} students
                        </span>
                        <span className="font-bold text-lg">
                          ${course.price}
                        </span>
                      </div>
                      <Button
                       onClick={() => addToCart(course)}
                       disabled={isInCart(course._id)}
                      className="w-full mt-4">
                         {isInCart(course._id) ? 'Added to Cart' : 'Add to Cart'}
                        </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

{/* ------------------------------Featured coureses -------------------------------*/}
          



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