export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = (await import('@/lib/supabase/server')).createClient();
  // Set products in this category to null
  await (await supabase).from('products').update({ category_id: null }).eq('category_id', id);
  const { error } = await (await supabase).from('categories').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
