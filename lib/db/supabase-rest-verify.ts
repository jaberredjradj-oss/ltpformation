export async function verifySupabaseKeyViaRest(
  url: string,
  key: string,
): Promise<{ ok: boolean; error: string | null }> {
  const baseUrl = url.replace(/\/$/, "");

  try {
    const response = await fetch(
      `${baseUrl}/rest/v1/planning_sessions?select=id&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      },
    );

    if (response.status === 401 || response.status === 403) {
      let message = `HTTP ${response.status}`;
      try {
        const payload = (await response.json()) as { message?: string; hint?: string };
        message = payload.message ?? message;
      } catch {
        // ignore JSON parse errors
      }
      return { ok: false, error: message };
    }

    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Supabase connectivity check failed.",
    };
  }
}
