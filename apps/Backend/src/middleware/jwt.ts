import { auth } from "express-oauth2-jwt-bearer";

const supabaseUrl = process.env["SUPABASE_URL"] as string;

export const checkJwt = auth({
  audience: "authenticated", // supabase uses 'authenticated' as audience for the JWT
  issuerBaseURL: `${supabaseUrl}/auth/v1`,
});
