import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SendCodeForm } from "@/pages/Auth/SendCode.tsx"
import { VerifyOTPForm } from "@/pages/Auth/VerifyCode.tsx"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"email" | "otp">("email")

  const handleSendCode = (email: string) => {
    console.log(`Code sent to ${email}`) // Replace with actual send code logic
    setStep("otp")
  }

  const handleVerifyOTP = (otp: string) => {
    const validOtp = "123456" // Replace with the actual OTP validation logic
    if (otp === validOtp) {
      alert("OTP Verified! Redirecting...")
      navigate("/login") // Redirect to login
    } else {
      alert("Invalid OTP! Please try again.")
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Card className="w-[350px] md:w-[450px] lg:w-[550px] md:h-auto">
        <CardHeader className="md:pt-10">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="md:px-10">
          {step === "email" ? (
            <SendCodeForm onSendCode={handleSendCode} />
          ) : (
            <VerifyOTPForm onVerifyOTP={handleVerifyOTP} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between md:pb-10">
          <Link to="/forgot-password" className="text-sm md:text-base text-blue-600 hover:underline">
            Resend OTP
          </Link>
          <Link to="/login" className="text-sm md:text-base text-blue-600 hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

