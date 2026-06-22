export const dynamic = "force-dynamic";

type IntegrationCheck = {
  id: string;
  label: string;
  created_at: string;
};

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return Response.json(
      {
        ok: false,
        message: "Supabase environment variables are missing.",
      },
      { status: 500 },
    );
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/integration_checks?select=id,label,created_at&order=created_at.desc&limit=1`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return Response.json(
      {
        ok: false,
        status: response.status,
        message: "Supabase request failed.",
      },
      { status: 502 },
    );
  }

  const rows = (await response.json()) as IntegrationCheck[];

  return Response.json({
    ok: true,
    projectRef: "pgopszsciryyyxgkqykl",
    latestCheck: rows[0] ?? null,
  });
}
