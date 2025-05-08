import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.NOTIFY_WEBHOOK || "";

// Send notification to Discord
async function sendDiscordNotification() {
  try {
    const timestamp = new Date().toISOString();

    const payload = {
      embeds: [
        {
          title: "Greet Notification",
          description: "Someone just greeted you!",
          color: 14177041,
          footer: { text: "Greeting Notification" },
          timestamp,
        },
      ],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to send Discord notification:", await res.text());
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

// GET handler
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
  res: NextResponse
) {
  try {
    sendDiscordNotification().catch(console.error);
    return new Response(null, { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 500, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
