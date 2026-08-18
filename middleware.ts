import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les variables d'environnement Supabase ne sont pas encore configurées sur Vercel, on continue sans crasher
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
                        request.nextUrl.pathname.startsWith("/register") ||
                        request.nextUrl.pathname.startsWith("/forgot-password");

    const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
                             request.nextUrl.pathname.startsWith("/factures") ||
                             request.nextUrl.pathname.startsWith("/clients") ||
                             request.nextUrl.pathname.startsWith("/parametres") ||
                             request.nextUrl.pathname.startsWith("/rapports");

    // Si l'utilisateur n'est pas connecté et tente d'accéder à une route API
    if (!user && isApiRoute) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Si l'utilisateur est déjà connecté et tente d'accéder aux pages d'auth
    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Middleware Supabase error:", error);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
