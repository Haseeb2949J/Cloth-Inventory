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
import { Loader2, AlertCircle, CheckCircle, Mail, Shield, ExternalLink } from "lucide-react"

interface SecureAuthFormProps {
  mode: "login" | "signup" | "forgot-password"
}

export function SecureAuthForm({ mode }: SecureAuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showEmailTips, setShowEmailTips] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error parameters
    const errorParam = searchParams.get("error")
    if (errorParam === "auth_error") {
      setError("Authentication failed. Please try again.")
    } else if (errorParam === "confirmation_error") {
      setError("Email confirmation failed. Please try signing up again.")
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
    setShowEmailTips(false)

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
            setError("Please check your email and confirm your account before signing in.")
            setShowEmailTips(true)
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
            emailRedirectTo: `${window.location.origin}/auth/callback`,
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

        if (data.user && !data.user.email_confirmed_at) {
          setMessage("Please check your email and click the confirmation link to complete your registration!")
          setShowEmailTips(true)
        } else if (data.user) {
          // User is auto-confirmed (shouldn't happen with email confirmations enabled)
          setMessage("Account created successfully! Redirecting...")
          setTimeout(() => router.push("/dashboard"), 1000)
        }
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
          setError(error.message)
          return
        }

        setMessage("Check your email for the password reset link!")
        setShowEmailTips(true)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      setMessage("Confirmation email resent! Please check your inbox.")
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
        return "Create a new account with email verification for security"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "signup" ? <Shield className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
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

        {showEmailTips && (
          <Alert className="mt-4">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium">Not receiving emails?</p>
                <div className="space-y-2 text-sm">
                  <p>• Check your spam/junk folder</p>
                  <p>• Make sure you entered the correct email address</p>
                  <p>• Wait a few minutes for the email to arrive</p>
                  <p>• Try using Gmail, Outlook, or another email provider</p>
                </div>

                <div className="pt-2 space-y-2">
                  {mode === "signup" && (
                    <Button variant="outline" size="sm" onClick={resendConfirmation} disabled={loading}>
                      Resend Confirmation Email
                    </Button>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Still having issues?</p>
                    <p>You can configure email settings in your Supabase dashboard:</p>
                    <p>Authentication → Settings → SMTP Settings</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                    >
                      Open Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {mode === "signup" && !showEmailTips && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">Secure Account Creation</p>
                <p className="text-blue-700 dark:text-blue-300">
                  We'll send you a confirmation email to verify your account and ensure security.
                </p>
              </div>
            </div>
          </div>
        )}

        {mode === "login" && !showEmailTips && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">Simple Login</p>
                <p className="text-green-700 dark:text-green-300">
                  Once your account is verified, you can login instantly with just email and password.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
