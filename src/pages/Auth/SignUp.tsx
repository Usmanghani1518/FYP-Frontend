import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import  Loading  from "@/shared/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import VerifyAccount from "./VerifyAccount";
import { notifyResponse } from "@/Helper/notify";
import { backendRequest } from "@/Helper/backendRequest";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [loading,setLoading]=useState(false)
  const [verified,setVerified]=useState(false)
  const [email,setEmail]=useState("")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoading(true)
     try {
          const response = await backendRequest("POST", "/auth/signup", {
            name:values.fullName,
            role:"student",
            email: values.email,
            password: values.password,
          });
          console.log(response);
          if (response.success) {
            notifyResponse(response);
            setEmail(values.email)
            setVerified(true)
          } else {
            notifyResponse(response);
          }
        } catch (error) {
          console.log("Login failed", error); 
        }
        finally{
            setLoading(false);
        }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Image (visible on md and larger screens) */}
        <div className="hidden md:flex md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=1200&fit=crop"
              alt="Students studying"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="relative w-full flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <GraduationCap className="h-12 w-12 mb-4" />
              <h2 className="text-4xl font-bold mb-4">Welcome !</h2>
              <p className="text-lg text-white/90">
                Continue your learning journey with access to thousands of
                expert-led courses.
              </p>
            </div>
            <div className="space-y-4 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="font-medium text-lg">
                "Education is the passport to the future, for tomorrow belongs
                to those who prepare for it today."
              </p>
              <p className="text-sm text-white/80">- Malcolm X</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-8">
        {
          !verified?
          <Card className="w-[350px] md:w-[450px] lg:w-[550px] md:h-auto">
            <CardHeader className="md:pt-5">
              <CardTitle className="text-2xl md:text-3xl flex justify-center font-bold text-center">
                {/* Sign Up */}
                <img src="/imagies/Logo.png" className="w-32" alt="" />
              </CardTitle>
            </CardHeader>
            <CardContent className="md:px-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 md:space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            {...field}
                            className="md:text-lg"
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            className="md:text-lg"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                            className="md:text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            {...field}
                            className="md:text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button loading={loading} className="w-full md:text-lg md:py-6" type="submit">
                   Sign Up
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="md:pb-10  flex justify-center">
              <div className="text-sm md:text-base text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-custom_primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </Card>:
          <VerifyAccount email={email}/>
        }
        </div>
      </div>
    </div>
  );
}
