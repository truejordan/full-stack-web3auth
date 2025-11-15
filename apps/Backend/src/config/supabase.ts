import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { Database } from ".././types/database.types";

const supabaseUrl = process.env['SUPABASE_URL'] as string;
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] as string;
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);