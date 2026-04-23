import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, company, phone, message } = body;

  if (!name || !email || !company || !message) {
    return NextResponse.json({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  const { error } = await supabase.from("leads").insert({
    name,
    email,
    company,
    phone: phone || null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
