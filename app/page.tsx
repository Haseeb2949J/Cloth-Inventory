import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Database, Shield, Mail, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              <Shirt className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">ClothTracker</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Organize your wardrobe efficiently with secure cloud storage
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Shield className="h-6 w-6" />
                ClothTracker
              </CardTitle>
              <CardDescription className="text-center">
                Secure cloud storage with email verification for your wardrobe inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Database className="h-5 w-5 text-green-600" />
                  <span>Secure cloud storage - access from any device</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span>Email verification for account security</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Simple daily login after verification</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shirt className="h-5 w-5 text-green-600" />
                  <span>Complete wardrobe management system</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200 mb-1">Secure & Convenient</p>
                    <p className="text-green-700 dark:text-green-300">
                      Email verification for signup and password changes, simple login for daily use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/secure-signup">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/secure-login">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Forgot your password?{" "}
                  <Link href="/secure-forgot-password" className="text-primary hover:underline">
                    Reset it here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help with setup?{" "}
            <Link href="/setup" className="text-primary hover:underline">
              View setup guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
