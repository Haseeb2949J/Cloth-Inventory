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

interface OTPAuthFormProps {
  mode: "signup" | "login" | "forgot-password"
}

export function OTPAuthForm({ mode }: OTPAuthFormProps) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [otp, setOtp] = useState("")
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    setShowSetupHelp(false)

    try {
      if (mode === "signup") {
        // First, try to sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            // Don't send confirmation email
            emailRedirectTo: undefined,
          },
        })

        if (error) {
          // If signup fails due to email confirmations being enabled
          if (
            error.message.includes("Signup requires a valid password") ||
            error.message.includes("email") ||
            error.message.includes("confirmation")
          ) {
            setShowSetupHelp(true)
            setError("Email confirmations are still enabled in Supabase. Please disable them first.")
            return
          }
          throw error
        }

        if (data.user && !data.user.email_confirmed_at) {
          // User created but not confirmed - send OTP
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            },
          })

          if (otpError) {
            setShowSetupHelp(true)
            setError("Could not send OTP. Please check your Supabase email configuration.")
            return
          }

          setMessage("We've sent a 6-digit code to your email. Please enter it below.")
          setStep("otp")
        } else if (data.user && data.user.email_confirmed_at) {
          // User is auto-confirmed (email confirmations disabled)
          setMessage("Account created successfully! Redirecting...")
          setTimeout(() => router.push("/dashboard"), 1000)
        }
      } else if (mode === "login") {
        // Try OTP login directly (more reliable)
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        })

        if (error) {
          // Fallback to password login
          const { data: passwordData, error: passwordError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (passwordError) {
            if (passwordError.message.includes("Invalid login credentials")) {
              setError("Invalid email or password. Please check your credentials or try the OTP option.")
            } else {
              setError(passwordError.message)
            }
            return
          }

          if (passwordData.user) {
            router.push("/dashboard")
            return
          }
        }

        setMessage("We've sent a 6-digit code to your email. Please enter it below.")
        setStep("otp")
      } else if (mode === "forgot-password") {
        // Send OTP for password reset
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        })

        if (error) {
          setShowSetupHelp(true)
          setError("Could not send reset code. Please check your email configuration.")
          return
        }

        setMessage("We've sent a 6-digit code to your email. Please enter it below.")
        setStep("otp")
      }
    } catch (error: any) {
      if (error.message.includes("email") || error.message.includes("confirmation")) {
        setShowSetupHelp(true)
      }
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (error) throw error

      if (data.user) {
        setMessage("Successfully verified! Redirecting...")
        setTimeout(() => {
          if (mode === "forgot-password") {
            router.push("/reset-password")
          } else {
            router.push("/dashboard")
          }
        }, 1000)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) throw error

      setMessage("New code sent! Please check your email.")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    if (step === "otp") return "Enter Verification Code"
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
    if (step === "otp") return "Enter the 6-digit code sent to your email"
    switch (mode) {
      case "login":
        return "We'll send you a 6-digit login code via email"
      case "signup":
        return "Create a new account with OTP verification"
      case "forgot-password":
        return "Enter your email to receive a verification code"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === "otp" ? <Shield className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
          {getTitle()}
        </CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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

            {mode === "login" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to get login code"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send you a login code if you don't enter a password.
                </p>
              </div>
            )}

            {mode === "signup" && (
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
              {mode === "login" ? "Send Login Code" : mode === "signup" ? "Create Account" : "Send Reset Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                Code sent to {email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>

            <div className="text-center">
              <Button type="button" variant="link" onClick={resendOTP} disabled={loading} className="text-sm">
                Resend Code
              </Button>
            </div>
          </form>
        )}

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

        {step === "email" && !showSetupHelp && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">Secure OTP Authentication</p>
                <p className="text-blue-700 dark:text-blue-300">
                  We'll send a 6-digit code to your email for verification instead of confirmation links.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
