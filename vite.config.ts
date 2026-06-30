import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    host: true,
    port: 5174,
    proxy: {
      "/api": {
        target: "http://192.168.1.65:8000/api/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url);

            if (
              req.method &&
              ["POST", "PUT", "PATCH"].includes(req.method.toUpperCase())
            ) {
              let body = "";

              // Store original write method
              const originalWrite = proxyReq.write;
              const originalEnd = proxyReq.end;

              // Override write method to capture body chunks
              proxyReq.write = function (chunk) {
                if (chunk) {
                  body += chunk.toString();
                }
                return originalWrite.call(proxyReq, chunk);
              };

              // Override end method to log the complete body
              proxyReq.end = function (chunk) {
                if (chunk) {
                  body += chunk.toString();
                }

                // Log the request body
                if (body) {
                  try {
                    // Try to parse as JSON for better formatting
                    const parsedBody = JSON.parse(body);
                    console.log(
                      "Parsed Request Body:",
                      JSON.stringify(parsedBody, null, 2)
                    );
                  } catch {
                    // If not JSON, just log as string
                    console.log("Request Body (raw):", body);
                  }
                }

                return originalEnd.call(proxyReq, chunk);
              };
            }
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );

            let responseBody = "";

            proxyRes.on("data", (chunk) => {
              responseBody += chunk.toString();
            });

            proxyRes.on("end", () => {
              if (responseBody) {
                console.log(
                  "Response Body Length:",
                  responseBody.length,
                  "bytes"
                );

                try {
                  // Try to parse as JSON for better formatting
                  const parsedResponse = JSON.parse(responseBody);
                  console.log("Response Body (JSON):");
                  console.log(JSON.stringify(parsedResponse, null, 2));
                } catch {
                  // If not JSON, log first 2000 characters to avoid overwhelming console
                  const truncatedBody =
                    responseBody.length > 2000
                      ? responseBody.substring(0, 2000) +
                        `... (truncated, total: ${responseBody.length} chars)`
                      : responseBody;
                  console.log("Response Body (raw):", truncatedBody);
                }
              } else {
                console.log("Response Body: (empty)");
              }
              console.log("============================================\n");
            });

            proxyRes.on("error", (err) => {
              console.error("Response stream error:", err);
            });
          });
        },
      },
      "/storage": {
        target: "http://192.168.1.65:8000/storage/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    manifest: true,
  },
  plugins: [
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      strategies: "injectManifest",
      srcDir: "src/pwa",
      filename: "sw.ts",
      workbox: {
        disableDevLogs: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpeg,jpg,webp,woff,woff2,ttf,eot}"],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
      },
      manifest: {
        name: "بازدید فنی",
        short_name: "بازدید فنی",
        description: "نرم افزار بازدید فنی",
        theme_color: "#30eca5",
        background_color: "#ffffff",
        lang: "fa",
        orientation: "portrait-primary",
        display: "standalone",
        start_url: "/",
        id: "/",
        icons: [
          {
            src: "/favicon.png",
            sizes: "any",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectManifest: {
        swSrc: 'src/pwa/sw.ts',
        swDest: 'dist/sw.js',
        injectionPoint: undefined
      }
    }),
    react(),
    mkcert(),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
});
