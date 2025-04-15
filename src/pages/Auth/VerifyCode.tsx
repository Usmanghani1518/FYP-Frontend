
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap } from "lucide-react";
import { useState } from 'react';
import { backendRequest } from '@/Helper/backendRequest';
import VerifyAccount from './VerifyAccount';
import { notifyResponse } from '@/Helper/notify';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});



interface LoginResponse{
  success:boolean,
  verified:boolean,
  resUser:{
    role:string,
    name:string,
    email:string,
    profilePicture:string
    verified:boolean
    success:boolean
  }
  

}


export default function VerifyCode({email}:{email:string}) {
 
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
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-lg text-white/90">
                Continue your learning journey with access to thousands of expert-led courses.
              </p>
            </div>
            <div className="space-y-4 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="font-medium text-lg">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</p>
              <p className="text-sm text-white/80">- Malcolm X</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
         {
          <VerifyAccount email={email}/>
         }

        </div>
      </div>
    </div>
  );
}