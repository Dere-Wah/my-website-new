import { NextRequest, NextResponse } from "next/server";
import { supabase, EmailSubscription } from "@/lib/supabase";
import { z } from "zod";

// Email validation schema
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// UUID validation schema
const uuidSchema = z.string().uuid("Invalid UUID format");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    const validation = emailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if email already exists and is not unsubscribed
    const { data: existingSubscription, error: checkError } = await supabase
      .from("emails")
      .select("*")
      .eq("email", email)
      .is("unsubscribed_at", null)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is expected for new emails
      console.error("Database check error:", checkError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existingSubscription) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 200 }
      );
    }

    // Check if email was previously subscribed but unsubscribed
    const { data: unsubscribedEmail, error: unsubCheckError } = await supabase
      .from("emails")
      .select("*")
      .eq("email", email)
      .not("unsubscribed_at", "is", null)
      .single();

    if (unsubCheckError && unsubCheckError.code !== "PGRST116") {
      console.error("Unsubscribe check error:", unsubCheckError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (unsubscribedEmail) {
      // Resubscribe by clearing unsubscribed_at
      const { error: resubscribeError } = await supabase
        .from("emails")
        .update({
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
        })
        .eq("id", unsubscribedEmail.id);

      if (resubscribeError) {
        console.error("Resubscribe error:", resubscribeError);
        return NextResponse.json(
          { error: "Failed to resubscribe" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Successfully resubscribed!", id: unsubscribedEmail.id },
        { status: 200 }
      );
    }

    // Insert new subscription
    const { data: newSubscription, error: insertError } = await supabase
      .from("emails")
      .insert([{ email }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed!", id: newSubscription.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unsubscribeId = searchParams.get("unsubscribe");

    if (!unsubscribeId) {
      return NextResponse.json(
        { error: "Missing unsubscribe parameter" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidValidation = uuidSchema.safeParse(unsubscribeId);
    if (!uuidValidation.success) {
      return NextResponse.json(
        { error: "Invalid unsubscribe ID format" },
        { status: 400 }
      );
    }

    // Check if the subscription exists and is currently subscribed
    const { data: subscription, error: fetchError } = await supabase
      .from("emails")
      .select("*")
      .eq("id", unsubscribeId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        // No subscription found with this ID
        return NextResponse.redirect(
          "https://derewah.dev?error=invalid_unsubscribe"
        );
      }
      console.error("Fetch subscription error:", fetchError);
      return NextResponse.redirect("https://derewah.dev?error=database_error");
    }

    if (subscription.unsubscribed_at) {
      // Already unsubscribed
      return NextResponse.redirect(
        "https://derewah.dev?message=already_unsubscribed"
      );
    }

    // Update the subscription to mark as unsubscribed
    const { error: updateError } = await supabase
      .from("emails")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("id", unsubscribeId);

    if (updateError) {
      console.error("Unsubscribe update error:", updateError);
      return NextResponse.redirect(
        "https://derewah.dev?error=unsubscribe_failed"
      );
    }

    // Redirect to main site with success message
    return NextResponse.redirect("https://derewah.dev?message=unsubscribed");
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.redirect("https://derewah.dev?error=server_error");
  }
}
