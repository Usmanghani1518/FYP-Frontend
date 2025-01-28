import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import OtpInput from "react-otp-input"

const formSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be at least 6 characters" })
    .max(6, { message: "OTP must be at most 6 characters" }),
})

interface VerifyOTPFormProps {
  onVerifyOTP: (otp: string) => void
}

export function VerifyOTPForm({ onVerifyOTP }: VerifyOTPFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  const [otp, setOtp] = useState("")

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onVerifyOTP(values.otp)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <OtpInput
                  value={otp}
                  onChange={(value) => {
                    setOtp(value)
                    field.onChange(value)
                  }}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  containerStyle={{ justifySelf: "center" }}
                  inputStyle={{
                    border: "2px solid black",
                    minWidth: "50px",
                    minHeight: "50px",
                    borderRadius: "8px",
                  }}
                  renderInput={(props) => <input {...props} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full md:text-lg md:py-6" type="submit">
          Verify OTP
        </Button>
      </form>
    </Form>
  )
}

