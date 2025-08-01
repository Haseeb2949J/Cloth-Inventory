import Link from "next/link"
import { SecureAuthForm } from "@/components/secure-auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Shirt, ArrowLeft } from "lucide-react"

export default function SecureLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Shirt className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ClothTracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Secure cloud storage with verified accounts</p>
        </div>

        <SecureAuthForm mode="login" />

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {"Don't have an account? "}
            <Link href="/secure-signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/secure-forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
