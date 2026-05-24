export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { validateSupabaseEnvironment } = await import("@/lib/db/supabase-env");
  void validateSupabaseEnvironment().catch((error) => {
    console.error(
      "[supabase:env] Startup validation failed:",
      error instanceof Error ? error.message : error,
    );
  });

  const { ensureDocumentsInfrastructure } = await import("@/lib/documents/infrastructure");
  void ensureDocumentsInfrastructure().catch((error) => {
    console.error(
      "[documents:infra] startup bootstrap failed:",
      error instanceof Error ? error.message : error,
    );
  });
}
