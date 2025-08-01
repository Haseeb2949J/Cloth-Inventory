import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/dashboard"

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash,
      })

      if (!error) {
        return NextResponse.redirect(`${request.nextUrl.origin}${next}`)
      }
    } catch (error) {
      console.error("Error confirming auth:", error)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${request.nextUrl.origin}/?error=confirmation_error`)
}
