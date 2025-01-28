import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

interface SendCodeFormProps {
  onSendCode: (email: string) => void
}

export function SendCodeForm({ onSendCode }: SendCodeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSendCode(values.email)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email to send code" {...field} className="md:text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full md:text-lg md:py-6" type="submit">
          Send Code
        </Button>
      </form>
    </Form>
  )
}

