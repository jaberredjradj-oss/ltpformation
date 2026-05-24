import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_NO_REALTIME_OPTIONS } from "@/lib/db/supabase-client-options";
import {
  getPublicSupabasePublishableKey,
  getPublicSupabaseUrl,
  isPublicAdminAuthEnabled,
} from "@/lib/db/supabase-env-public";

export async function proxy(request: NextRequest) {
  if (!isPublicAdminAuthEnabled()) {
    return NextResponse.next();
  }

  const url = getPublicSupabaseUrl();
  const anonKey = getPublicSupabasePublishableKey();
  if (!url || !anonKey) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute || isLoginRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    url,
    anonKey,
    {
      ...SUPABASE_NO_REALTIME_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
