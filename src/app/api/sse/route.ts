// app/api/sse/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Important for SSE

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = (data: any) => {
    const encoder = new TextEncoder();
    console.log("DATA SERVER: ", data);
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Store the event sender to be used from the Upstash Job.
  (global as any).sseEventSender = { send: sendEvent };

  const readableStream = stream.readable;

  const response = new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  return response;
}
