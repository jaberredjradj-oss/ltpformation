// Configuration en JavaScript pur, volontairement — pas en TypeScript.
//
// Le serveur de compilation de l'hébergeur a une glibc trop ancienne pour le
// compilateur natif de Next (16.3.x exige GLIBC_2.30). Next se rabat alors sur
// sa version WebAssembly, avec deux conséquences :
//   1. il ne sait plus transpiler un `next.config.ts` (échec de chargement) ;
//   2. Turbopack ne peut pas tourner du tout — d'où `next build --webpack`.
// Ne pas repasser ce fichier en .ts sans avoir vérifié que l'hébergeur a évolué.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadBuildInfo() {
  if (process.env.NEXT_PUBLIC_BUILD_ID?.trim()) {
    return {
      id: process.env.NEXT_PUBLIC_BUILD_ID.trim(),
      time: process.env.NEXT_PUBLIC_BUILD_TIME?.trim() ?? new Date().toISOString(),
    };
  }

  const buildIdFile = path.join(process.cwd(), "build-id.json");
  if (existsSync(buildIdFile)) {
    try {
      const parsed = JSON.parse(readFileSync(buildIdFile, "utf8"));
      if (parsed.id) {
        return {
          id: parsed.id,
          time: parsed.time ?? new Date().toISOString(),
        };
      }
    } catch {
      // fall through
    }
  }

  try {
    return {
      id: execSync("git rev-parse --short HEAD", {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
      time: new Date().toISOString(),
    };
  } catch {
    return { id: "unknown", time: new Date().toISOString() };
  }
}

const buildInfo = loadBuildInfo();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: buildInfo.id,
    NEXT_PUBLIC_BUILD_TIME: buildInfo.time,
  },
  generateBuildId: async () => buildInfo.id,
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      {
        // Hashed JS/CSS — safe to cache forever; filename changes every deploy.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML/app routes — must revalidate so cached pages never reference stale chunks.
        source:
          "/:path((?!_next/static|_next/image|images|certifications|documents|logo\\.png|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, must-revalidate",
          },
          {
            key: "X-Build-Id",
            value: buildInfo.id,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
