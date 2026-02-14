Deno.serve((req: Request) => {
  const url = new URL(req.url);

  // UUID خودت رو اینجا بگذار (از uuidgenerator.net بگیر)
  const uuid = "51c18d3e-7513-488b-b168-de11dd5937f1";

  // مسیر دلخواه (می‌تونی عوض کنی)
  const path = "/vless";

  if (url.pathname === path) {
    // لینک کانفیگ VLESS رو برگردون
    const config = `vless://${uuid}@${url.host}:443?encryption=none&security=tls&type=ws&path=%2F${path}&host=${url.host}#My-Deno-VLESS`;
    return new Response(config, { status: 200 });
  }

  // پروکسی ترافیک (SNI رو به سایت مجاز عوض کن)
  const targetUrl = `https://www.google.com${url.pathname}${url.search}`; // یا digikala.com
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
