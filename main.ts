import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const uuid = "51c18d3e-7513-488b-b168-de11dd5937f1"
const path = "/vless"; // مسیر دلخواه (می‌تونی عوض کنی)

serve((req: Request) => {
  const url = new URL(req.url);

  // اگر درخواست کانفیگ بود، لینک VLESS برگردون
  if (url.pathname === path) {
    const config = `vless://${uuid}@${url.host}:443?encryption=none&security=tls&type=ws&path=%2F${path}&host=${url.host}#My-Deno-VLESS`;
    return new Response(config, { status: 200 });
  }

  // پروکسی ترافیک (SNI رو به سایت مجاز عوض کن)
  const targetUrl = `https://www.google.com${url.pathname}${url.search}`; // می‌تونی به digikala.com تغییر بدی
  const newReq = new Request(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    redirect: "follow",
  });

  newReq.headers.set("Host", "www.google.com"); // SNI واقعی
  newReq.headers.set("X-Forwarded-For", "1.1.1.1"); // مخفی کردن IP

  return fetch(newReq);
});
