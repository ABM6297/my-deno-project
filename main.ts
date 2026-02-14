import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve((req) => {
  return new Response("Hello from Deno Deploy!", { status: 200 });
});
