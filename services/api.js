export async function simulateRequest(payload, delay = 180) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return payload;
}
