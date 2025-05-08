// app/api/purge/route.ts

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // disable caching
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  return await handlePurge();
}

export async function POST(_req: NextRequest) {
  return await handlePurge();
}

async function handlePurge() {
  try {
    const camoUrls = [
      "https://camo.githubusercontent.com/58ab0d9e31a67b9c2599193c4e52b83c94fd21a99e24580a2ce74a9d9d9537b4/68747470733a2f2f646572657761682e6465762f6170692f726563656e742d70726f6a656374732d302e737667",
      "https://camo.githubusercontent.com/124f794d3697875236d5b411ce10899e6cbf5451d350685f639dbe9caaf8aa31/68747470733a2f2f646572657761682e6465762f6170692f726563656e742d70726f6a656374732d312e737667",
      "https://camo.githubusercontent.com/631338c5776b29624692e2c0a965a0bc4b1cdde953f9ff0e61e27dabf9eab140/68747470733a2f2f646572657761682e6465762f6170692f726563656e742d70726f6a656374732d322e737667",
      "https://camo.githubusercontent.com/09536f113f82a6e5693119a0f50c05a947d7720955d696085a31c820b3ae108a/68747470733a2f2f646572657761682e6465762f6170692f726563656e742d70726f6a656374732d332e737667",
    ];

    const results = [];

    for (const url of camoUrls) {
      try {
        const purgeResponse = await fetch(url, {
          method: "PURGE",
          headers: {
            "User-Agent": "Next.js/PurgeBot",
          },
        });

        results.push({
          url,
          status: purgeResponse.status,
          statusText: purgeResponse.statusText,
          success: purgeResponse.ok,
        });
      } catch (error: any) {
        results.push({
          url,
          success: false,
          error: error.message || "Unknown error",
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    return new Response(
      JSON.stringify(
        {
          message: `Purge completed. ${successful} successful, ${failed} failed.`,
          timestamp: new Date().toISOString(),
          details: results,
        },
        null,
        2
      ),
      {
        status: failed > 0 ? 207 : 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: true,
        message: err.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
