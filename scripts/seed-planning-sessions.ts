import { createClient } from "@supabase/supabase-js";
import { PLANNING_SESSIONS } from "../lib/planning/sessions";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const rows = PLANNING_SESSIONS.map((session) => ({
    id: session.id,
    formation_slug: session.formationSlug,
    formation_title: session.formationTitle,
    session_type: session.sessionType,
    category: session.category,
    category_label: session.categoryLabel,
    start_date: session.startDate,
    end_date: session.endDate,
    exam_date: session.examDate,
    schedule_label: session.scheduleLabel,
    location: session.location,
    notes: session.notes,
    cpf_eligible: session.cpfEligible,
    certification_code: session.certificationCode,
    status: session.status,
    seats_total: session.seatsTotal,
    seats_taken: session.seatsTaken,
    visible: session.visible,
    year: session.year,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await client.from("planning_sessions").upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} planning sessions.`);
}

main().catch((error) => {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
