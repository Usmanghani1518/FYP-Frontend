import {Link} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle form submission
  }
  return (
    <div className='bg-gray-100 min-h-screen flex items-center justify-center'>  

  
    <Card className="w-[350px] md:w-[450px] lg:w-[550px] md:h-auto">
      <CardHeader className="md:pt-10">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="md:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} className="md:text-lg" />
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
                    <Input type="password" placeholder="Password" {...field} className="md:text-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button  className="w-full md:text-lg md:py-6 bg-custom_primary hover:bg-custom_primary_hover" type="submit">Login</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 md:pb-10">
        <Link to="/forgot-password" className="text-sm md:text-base text-blue-600 hover:underline">
          Forgot password?
        </Link>
        <div className="text-sm md:text-base text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-custom_primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}

