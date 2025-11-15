# Express + Supabase + web3auth Backend server

To generate types for supabse Db see:
https://supabase.com/docs/guides/api/rest/generating-types

Followe the steps from the url to login, then generate database types with:
`npx supabase gen types typescript --project-id <project ID> --schema public > src/types/database.types.ts`
you can find your project ID in the supabase dashboard