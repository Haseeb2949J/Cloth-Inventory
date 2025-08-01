"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, Mail, Database } from "lucide-react"

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [authSettings, setAuthSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
    fetchUsers()
    checkAuthSettings()
  }, [])

  const checkAdminAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = "/"
      return
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const checkAuthSettings = async () => {
    try {
      // This is a simplified check - in production you'd need admin privileges
      const { data, error } = await supabase.auth.getSession()
      setAuthSettings({
        hasSession: !!data.session,
        emailConfirmationRequired: true, // This would come from your Supabase settings
      })
    } catch (error) {
      console.error("Error checking auth settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEmailConfirmation = async () => {
    // This would require admin API access in production
    alert("This feature requires Supabase admin access. Please check your Supabase dashboard settings.")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Auth Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Manage authentication and email settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium">Email Issues Troubleshooting:</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>1. Check Supabase Dashboard:</strong> Go to Authentication {">"} Settings {">"} SMTP
                      Settings
                    </p>
                    <p>
                      <strong>2. Email Confirmations:</strong> In Authentication {">"} Settings, check if "Enable email
                      confirmations" is enabled
                    </p>
                    <p>
                      <strong>3. SMTP Provider:</strong> Supabase uses their own SMTP by default, but you can configure
                      custom SMTP
                    </p>
                    <p>
                      <strong>4. Rate Limits:</strong> Free tier has email sending limits (30 emails/hour)
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" onClick={toggleEmailConfirmation}>
                      Configure Email Settings
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({users.length})
            </CardTitle>
            <CardDescription>Manage user accounts and profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.length === 0 ? (
                <p className="text-muted-foreground">No users found</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.full_name || "No name"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={() => window.open("https://supabase.com/dashboard/project", "_blank")}
              className="w-full justify-start"
            >
              Open Supabase Dashboard
            </Button>
            <Button variant="outline" onClick={fetchUsers} className="w-full justify-start bg-transparent">
              Refresh User List
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full justify-start"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
