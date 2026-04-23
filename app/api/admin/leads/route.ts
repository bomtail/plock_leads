import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "데이터를 불러오는데 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ leads: data });
}
