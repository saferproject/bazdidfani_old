/** Bound expensive photo work while retaining the source order. */
export async function mapWithConcurrency<T, R>(
  values: readonly T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("Concurrency must be a positive integer.");
  const results = new Array<R>(values.length);
  let nextIndex = 0;
  let failed = false;
  const worker = async () => {
    while (!failed && nextIndex < values.length) {
      const index = nextIndex++;
      try {
        results[index] = await mapper(values[index], index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  const workers = await Promise.allSettled(
    Array.from({ length: Math.min(concurrency, values.length) }, worker),
  );
  const rejected = workers.find((result): result is PromiseRejectedResult => result.status === "rejected");
  if (rejected) throw rejected.reason;
  return results;
}
