import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!CLERK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType == "user.created") {
    const { id, first_name, image_url } = evt.data;

    const data = await db.insert(usersTable).values({
      clerkId: id,
      name: first_name || "User",
      imageUrl: image_url,
    });
    console.log("Done User Added", data);
  }

  if (eventType == "user.deleted") {
    const { id } = evt.data;
    if (!id) {
      return new Response("Missing User Id", { status: 400 });
    }
    const res = await db.delete(usersTable).where(eq(usersTable.clerkId, id));
    console.log("Res : ", res);
  }

  if (eventType == "user.updated") {
    const { id, first_name, last_name, image_url } = evt.data;
    let fullName = first_name!;
    if (last_name) {
      fullName = first_name + last_name;
    }
    await db
      .update(usersTable)
      .set({
        name: fullName,
        imageUrl: image_url,
      })
      .where(eq(usersTable.clerkId, id));
    console.log("Done Updating");
  }
  return new Response("Webhook received", { status: 200 });
}
