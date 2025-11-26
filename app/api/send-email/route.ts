import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// Request body interface
interface EmailRequest {
  email: string;
  content: string;
  password: string;
  subject?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: EmailRequest = await req.json();
    const { email, content, password, subject = "Email from Website" } = body;

    if (password !== process.env.API_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid password" },
        { status: 401 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "newsletter@derewah.dev",
      to: email,
      subject: subject,
      html: content,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
