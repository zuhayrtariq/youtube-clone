export async function notifyClient(jobId: string) {
  (global as any).sseEventSender.send({ type: "jobCompleted", jobId });
}
