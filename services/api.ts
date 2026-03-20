export async function simulateRequest<T>(payload: T, delay = 180): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return payload;
}
