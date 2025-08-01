import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
  },
})

export type ClothItem = {
  id: string
  user_id: string
  name: string
  category: "fresh" | "wearing" | "dirty"
  color?: string
  type?: string
  brand?: string
  size?: string
  notes?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
