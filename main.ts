Deno.serve((req: Request): Response | Promise<Response> => {
  const url = new URL(req.url);

  // UUID رو اینجا تغییر بده
  const uuid = "51c18d3e-7513-488b-b168-de11dd5937f1"; // عوض کن

  const path = "/vless";

  if (url.pathname === path) {
    const config = `vless://${uuid}@${url.host}:443?encryption=none&security=tls&type=ws&path=%2F${path}&host=${url.host}#My-Deno-VLESS`;
    return new Response(config, { status: 200 });
  }

  // پروکسی ترافیک
  const targetUrl = `https://www.google.com${url.pathname}${url.search}`;
  const newReq = new Request(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    redirect: "follow",
  });

  newReq.headers.set("Host", "www.google.com");
  newReq.headers.set("X-Forwarded-For", "1.1.1.1");

  return fetch(newReq);
});
