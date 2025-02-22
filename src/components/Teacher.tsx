import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  headline: z
    .string()
    .min(10, { message: "Headline must be at least 10 characters" }),
  email: z.string().min(2,{message:"email is required"}).email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  experience: z
    .string()
    .min(1, { message: "Please select your experience level" }),
});

const Teacher = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      headline: "",
      email: "",
      password: "",
      experience: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log(values);
      // Add your API call here
      setOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen relative flex items-center">
      <div className="container mx-auto px-12 xl:px-20 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* <h1 className="text-4xl font-bold text-gray-900">
             
            </h1> */}
            <div>
              <h2 className="text-3xl font-bold font-josefin uppercase  ">
                Come teach with us
              </h2>
              <hr className="text-custom_primary p-[1.5px] rounded-sm bg-custom_primary mt-2 mb-12 w-32" />
            </div>
            <p className="text-xl text-gray-600">
              Become an instructor and change lives — including your own
            </p>
            <p className="text-gray-600">
              Join our community of passionate educators and share your
              knowledge with students worldwide. Our platform provides you with
              the tools and support needed to create engaging courses and reach
              eager learners.
            </p>
           

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className=" text-white"
                >
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Begin Your Teaching Journey
                  </DialogTitle>
                  <DialogDescription>
                    Fill in your details to start creating impactful courses
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4 gap-4"
                  >
                    <div className="grid sm:grid-cols-2  items-center gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="flex"> */}
                            Name
                            <span className="text-red-700 ml-1">*</span>
                          {/* </FormLabel> */}
                          {/* <FormControl> */}
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          {/* </FormControl> */}
                          <FormMessage  />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="headline"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="flex"> */}
                            Headline
                            <span className="text-red-500 ml-1">*</span>
                          {/* </FormLabel> */}
                          <FormControl>
                            <Input
                              placeholder="Enter your headline"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="flex"> */}
                            Email
                            <span className="text-red-500 ml-1">*</span>
                          {/* </FormLabel> */}
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="flex"> */}
                            Password
                            <span className="text-red-500 ml-1">*</span>
                          {/* </FormLabel> */}
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="flex"> */}
                            Experience Level
                            <span className="text-red-500 ml-1">*</span>
                          {/* </FormLabel> */}
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>

                    <Button
                      type="submit"
                      className="w-full  text-white mt-6"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right Image */}
          <div className="relative h-96">
            <img
              src="/imagies/Land/heroCarousel1.jpg"
              alt="Teaching"
              className="rounded-lg shadow-xl object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;



// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// const formSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   headline: z.string().min(10, { message: "Headline must be at least 10 characters" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(8, { message: "Password must be at least 8 characters" }),
//   experience: z.string().min(1, { message: "Please select your experience level" }),
// });

// const Teacher = () => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       headline: "",
//       email: "",
//       password: "",
//       experience: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setLoading(true);
//     try {
//       console.log(values);
//       setOpen(false);
//     } catch (error) {
//       console.error("Submission failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-slate-100 min-h-screen relative flex items-center">
//       <div className="container mx-auto px-12 xl:px-20 py-12">
//         <div className="grid md:grid-cols-2 gap-8 items-center">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-3xl font-bold font-josefin uppercase">
//                 Come teach with us
//               </h2>
//               <hr className="text-custom_primary p-[1.5px] rounded-sm bg-custom_primary mt-2 mb-12 w-32" />
//             </div>
//             <p className="text-xl text-gray-600">
//               Become an instructor and change lives — including your own
//             </p>
//             <p className="text-gray-600">
//               Join our community of passionate educators and share your knowledge with students worldwide. Our platform provides you with the tools and support needed to create engaging courses and reach eager learners.
//             </p>

//             <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button size="lg" className="text-white">
//               Get Started
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-2xl">
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-bold">
//                 Begin Your Teaching Journey
//               </DialogTitle>
//               <DialogDescription>
//                 Fill in your details to start creating impactful courses
//               </DialogDescription>
//             </DialogHeader>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
//                 <div className="grid sm:grid-cols-2 items-center gap-4">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-gray-700">
//                           Name<span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Enter your full name"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="headline"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-gray-700">
//                           Headline<span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Enter your headline"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-gray-700">
//                           Email<span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="email"
//                             placeholder="Enter your email"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-gray-700">
//                           Password<span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="password"
//                             placeholder="Create a password"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="experience"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-gray-700">
//                           Experience Level<span className="text-red-500 ml-1">*</span>
//                         </FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select your experience level" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="beginner">Beginner</SelectItem>
//                             <SelectItem value="intermediate">Intermediate</SelectItem>
//                             <SelectItem value="advanced">Advanced</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full text-white mt-6"
//                   disabled={loading}
//                 >
//                   {loading ? "Submitting..." : "Submit Application"}
//                 </Button>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//           </div>

//           <div className="relative h-96">
//             <img
//               src="/imagies/Land/heroCarousel1.jpg"
//               alt="Teaching"
//               className="rounded-lg shadow-xl object-cover w-full h-full"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Teacher;
