"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, type ClothItem } from "@/lib/supabase"
import { ClothSection } from "@/components/cloth-section"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shirt, User, LogOut } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [clothes, setClothes] = useState<ClothItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchClothes()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/")
      return
    }

    setUser(user)

    // Ensure user has a profile
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error && error.code === "PGRST116") {
      // Profile doesn't exist, create it
      const { error: createError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "",
      })

      if (createError) {
        console.error("Error creating profile:", createError)
      }
    }
  }

  const fetchClothes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clothes:", error)
    } else {
      setClothes(data || [])
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const freshClothes = clothes.filter((item) => item.category === "fresh")
  const wearingClothes = clothes.filter((item) => item.category === "wearing")
  const dirtyClothes = clothes.filter((item) => item.category === "dirty")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Shirt className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">ClothTracker</h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Wardrobe</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your clothes across different categories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ClothSection title="Fresh & Clean" category="fresh" clothes={freshClothes} onUpdate={fetchClothes} />

          <ClothSection title="Currently Wearing" category="wearing" clothes={wearingClothes} onUpdate={fetchClothes} />

          <ClothSection title="Dirty & Pending" category="dirty" clothes={dirtyClothes} onUpdate={fetchClothes} />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{clothes.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fresh & Clean</h3>
            <p className="text-2xl font-bold text-green-600">{freshClothes.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Currently Wearing</h3>
            <p className="text-2xl font-bold text-blue-600">{wearingClothes.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Need Washing</h3>
            <p className="text-2xl font-bold text-red-600">{dirtyClothes.length}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
