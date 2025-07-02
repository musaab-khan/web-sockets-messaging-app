import { messagesQueue } from "./bullMQ";

async function inspectQueue() {
  const jobs = await messagesQueue.getJobs(['waiting', 'delayed', 'active', 'completed', 'failed']);

  if (!jobs.length) {
    console.log("🚫 No jobs found in queue.");
    return;
  }

  for (const job of jobs) {
    console.log(`🔍 Job ID: ${job.id}`);
    console.log("📦 Data:", job.data);
    console.log("📌 Status:", await job.getState());
    console.log("⏱ Timestamp:", new Date(job.timestamp).toLocaleString());
    console.log("-----------");
  }
}
inspectQueue();
