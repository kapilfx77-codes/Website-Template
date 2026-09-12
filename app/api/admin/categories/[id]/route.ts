export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { is_active } = await req.json();
  const supabase = (await import('@/lib/supabase/server')).createClient();
  const { error } = await (await supabase).from('categories').update({ is_active }).eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
