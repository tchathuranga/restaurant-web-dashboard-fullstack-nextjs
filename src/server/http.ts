// Prisma P2025: an update/delete targeted a row that does not exist
export function isNotFound(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2025';
}

// The thrown value's message when it has one, otherwise the caller's fallback text
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
