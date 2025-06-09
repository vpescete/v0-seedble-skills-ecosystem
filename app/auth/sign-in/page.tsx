import { SignInForm } from "@/components/auth/sign-in-form"
import { Zap } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Seedble Skills Ecosystem</h1>
      </div>
      <SignInForm />
    </div>
  )
}
