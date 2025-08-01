"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Settings, Mail, Database, Shield } from "lucide-react"

export default function SetupPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber],
    )
  }

  const setupSteps = [
    {
      id: 1,
      title: "Enable Email Confirmations (REQUIRED)",
      description: "Turn on email verification for secure account creation",
      icon: <Mail className="h-5 w-5" />,
      priority: "high",
      instructions: [
        "Go to your Supabase Dashboard",
        "Navigate to Authentication → Settings",
        "Find 'Enable email confirmations' toggle",
        "Turn it ON (enable it)",
        "Click 'Save' to apply changes",
        "This ensures secure signup with email verification",
      ],
      link: "https://supabase.com/dashboard",
      linkText: "Open Supabase Dashboard",
    },
    {
      id: 2,
      title: "Configure Email Sending",
      description: "Ensure Supabase can send confirmation emails",
      icon: <Settings className="h-5 w-5" />,
      priority: "medium",
      instructions: [
        "In Supabase Dashboard, go to Authentication → Settings",
        "Check 'SMTP Settings' section",
        "Supabase provides default email sending (30 emails/hour on free tier)",
        "For production, consider setting up custom SMTP (SendGrid, Mailgun, etc.)",
        "Test by trying to sign up - you should receive confirmation emails",
      ],
      link: "https://supabase.com/docs/guides/auth/auth-smtp",
      linkText: "SMTP Setup Guide",
    },
    {
      id: 3,
      title: "Run Database Setup Script",
      description: "Ensure all required tables and policies are created",
      icon: <Database className="h-5 w-5" />,
      priority: "medium",
      instructions: [
        "Go to Supabase Dashboard → SQL Editor",
        "Run the script: scripts/008-selective-email-confirmation.sql",
        "This will set up profiles and clothes tables",
        "Verify RLS policies are properly configured",
        "Check that the user creation trigger is working",
      ],
      link: "https://supabase.com/dashboard",
      linkText: "Open SQL Editor",
    },
    {
      id: 4,
      title: "Test Complete Flow",
      description: "Try the full signup, confirmation, and login process",
      icon: <Shield className="h-5 w-5" />,
      priority: "low",
      instructions: [
        "Go to the signup page",
        "Create a test account with a real email",
        "Check your email for a confirmation link",
        "Click the link to verify your account",
        "Try logging in with your credentials",
        "Verify you can access the dashboard and add clothes",
      ],
      link: "/secure-signup",
      linkText: "Test Signup",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">ClothTracker Setup Guide</h1>
          <p className="text-muted-foreground">Configure your secure cloth inventory system</p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Secure Cloud Storage Setup</p>
              <p>
                ClothTracker uses email verification for account security. Follow these steps to ensure everything works
                properly.
              </p>
              <p className="text-sm text-muted-foreground">
                Your data will be securely stored in the cloud and accessible from any device.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {setupSteps.map((step) => (
            <Card key={step.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      {step.icon}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {step.title}
                        <Badge className={getPriorityColor(step.priority)}>
                          {step.priority === "high" ? "REQUIRED" : step.priority.toUpperCase()}
                        </Badge>
                        {completedSteps.includes(step.id) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant={completedSteps.includes(step.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleStep(step.id)}
                  >
                    {completedSteps.includes(step.id) ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {step.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(step.link, step.link.startsWith("http") ? "_blank" : "_self")}
                    className="w-full sm:w-auto"
                  >
                    {step.linkText}
                    {step.link.startsWith("http") && <ExternalLink className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">
              Completed: {completedSteps.length} / {setupSteps.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.length / setupSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {completedSteps.length === setupSteps.length && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Setup Complete! 🎉</p>
                  <p>Your secure ClothTracker system is ready to use.</p>
                  <Button onClick={() => (window.location.href = "/secure-signup")} className="mt-2">
                    Start Using ClothTracker
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
