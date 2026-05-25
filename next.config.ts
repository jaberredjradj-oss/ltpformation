import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

function loadBuildInfo(): { id: string; time: string } {
  if (process.env.NEXT_PUBLIC_BUILD_ID?.trim()) {
    return {
      id: process.env.NEXT_PUBLIC_BUILD_ID.trim(),
      time: process.env.NEXT_PUBLIC_BUILD_TIME?.trim() ?? new Date().toISOString(),
    };
  }

  const buildIdFile = path.join(process.cwd(), "build-id.json");
  if (existsSync(buildIdFile)) {
    try {
      const parsed = JSON.parse(readFileSync(buildIdFile, "utf8")) as {
        id?: string;
        time?: string;
      };
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

const nextConfig: NextConfig = {
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
