"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Database, ExternalLink } from "lucide-react"

interface InstantAuthFormProps {
  mode: "login" | "signup" | "forgot-password"
}

export function InstantAuthForm({ mode }: InstantAuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showSetupHelp, setShowSetupHelp] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error parameters
    const errorParam = searchParams.get("error")
    if (errorParam === "auth_error") {
      setError("Authentication failed. Please try again.")
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user && mode === "login") {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [searchParams, mode, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    setShowSetupHelp(false)

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please check your credentials.")
          } else if (error.message.includes("Email not confirmed")) {
            setShowSetupHelp(true)
            setError("Email confirmations are still enabled. Please disable them in Supabase dashboard.")
          } else {
            setError(error.message)
          }
          return
        }

        if (data.user) {
          setMessage("Login successful! Redirecting...")
          setTimeout(() => router.push("/dashboard"), 1000)
        }
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) {
          if (error.message.includes("User already registered")) {
            setError("An account with this email already exists. Please sign in instead.")
          } else {
            setError(error.message)
          }
          return
        }

        if (data.user) {
          if (data.user.email_confirmed_at) {
            // User is auto-confirmed (email confirmations disabled)
            setMessage("Account created successfully! Redirecting...")
            setTimeout(() => router.push("/dashboard"), 1000)
          } else {
            // Email confirmations are still enabled
            setShowSetupHelp(true)
            setError("Email confirmations are enabled. Please disable them in Supabase dashboard for instant signup.")
          }
        }
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
          setError(error.message)
          return
        }

        setMessage("Password reset email sent! Check your inbox.")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Sign In"
      case "signup":
        return "Create Account"
      case "forgot-password":
        return "Reset Password"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Enter your credentials to access your cloth inventory"
      case "signup":
        return "Create a new account - no email verification required"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {getTitle()}
        </CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {mode !== "forgot-password" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getTitle()}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {showSetupHelp && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium">Setup Required:</p>
                <div className="space-y-2 text-sm">
                  <p>1. Go to your Supabase Dashboard</p>
                  <p>2. Navigate to Authentication → Settings</p>
                  <p>3. Turn OFF "Enable email confirmations"</p>
                  <p>4. Click Save and try again</p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                  >
                    Open Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Or try the{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => (window.location.href = "/simple")}
                    >
                      Simple Version
                    </Button>{" "}
                    which works without any setup.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!showSetupHelp && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">Cloud Storage Enabled</p>
                <p className="text-green-700 dark:text-green-300">
                  Your data is securely stored in the cloud and synced across devices.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
