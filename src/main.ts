import { apiRouter } from "./routes/api.routes.ts";
import { Application } from "@oak/oak/application";

const PORT = parseInt(Deno.env.get("PORT") || "8001");
const HOST = Deno.env.get("HOST") || "localhost";

const app = new Application();

// Serve static files from public directory
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen({
  port: PORT,
});

console.log(`Server is running on http://${HOST}:${PORT}`);
