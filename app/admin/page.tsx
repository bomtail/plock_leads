"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

type EditState = Omit<Lead, "id" | "created_at">;

const STATUSES = ["신규", "검토중", "완료"];

const STATUS_COLORS: Record<string, string> = {
  신규: "#C8A97E",
  검토중: "#7A6354",
  완료: "#3D2B1F",
};

export default function AdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    if (res.ok) {
      const { leads } = await res.json();
      setLeads(leads ?? []);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: string) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, status }),
    });
    if (res.ok) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  }

  function startEdit(lead: Lead) {
    setEditingId(lead.id);
    setEditState({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      phone: lead.phone ?? "",
      message: lead.message,
      status: lead.status,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
  }

  async function saveEdit(id: string) {
    if (!editState) return;
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editState),
    });
    setSaving(false);
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, ...editState, phone: editState.phone || null } : l
        )
      );
      setEditingId(null);
      setEditState(null);
    } else {
      alert("수정에 실패했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 리드를 삭제하시겠습니까?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } else {
      alert("삭제에 실패했습니다.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const inputStyle = {
    backgroundColor: "var(--input-bg)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  };

  return (
    <main className="min-h-screen px-4 py-10" style={{ backgroundColor: "var(--background)" }}>
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              리드 관리
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              총 {leads.length}건
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)", backgroundColor: "var(--card)" }}
          >
            로그아웃
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>
          </div>
        ) : leads.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>제출된 리드가 없습니다.</p>
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-2xl shadow-sm"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["이름", "이메일", "회사", "전화", "문의 내용", "상태", "제출일", "액션"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => {
                    const isEditing = editingId === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        style={{
                          borderBottom: i < leads.length - 1 ? "1px solid var(--border)" : "none",
                          backgroundColor: isEditing ? "#F5EFE6" : "transparent",
                        }}
                      >
                        {/* 이름 */}
                        <td className="px-4 py-3" style={{ color: "var(--foreground)", minWidth: "100px" }}>
                          {isEditing ? (
                            <input
                              style={inputStyle}
                              value={editState!.name}
                              onChange={(e) => setEditState((s) => s && { ...s, name: e.target.value })}
                            />
                          ) : (
                            <span className="font-medium">{lead.name}</span>
                          )}
                        </td>

                        {/* 이메일 */}
                        <td className="px-4 py-3" style={{ color: "var(--foreground)", minWidth: "160px" }}>
                          {isEditing ? (
                            <input
                              style={inputStyle}
                              type="email"
                              value={editState!.email}
                              onChange={(e) => setEditState((s) => s && { ...s, email: e.target.value })}
                            />
                          ) : (
                            lead.email
                          )}
                        </td>

                        {/* 회사 */}
                        <td className="px-4 py-3" style={{ color: "var(--foreground)", minWidth: "100px" }}>
                          {isEditing ? (
                            <input
                              style={inputStyle}
                              value={editState!.company}
                              onChange={(e) => setEditState((s) => s && { ...s, company: e.target.value })}
                            />
                          ) : (
                            lead.company
                          )}
                        </td>

                        {/* 전화 */}
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)", minWidth: "110px" }}>
                          {isEditing ? (
                            <input
                              style={inputStyle}
                              type="tel"
                              value={editState!.phone ?? ""}
                              onChange={(e) => setEditState((s) => s && { ...s, phone: e.target.value })}
                            />
                          ) : (
                            lead.phone ?? "-"
                          )}
                        </td>

                        {/* 문의 내용 */}
                        <td className="px-4 py-3" style={{ color: "var(--foreground)", minWidth: "200px", maxWidth: "260px" }}>
                          {isEditing ? (
                            <textarea
                              style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }}
                              value={editState!.message}
                              onChange={(e) => setEditState((s) => s && { ...s, message: e.target.value })}
                            />
                          ) : (
                            <span className="line-clamp-3 block" style={{ whiteSpace: "pre-wrap" }}>
                              {lead.message}
                            </span>
                          )}
                        </td>

                        {/* 상태 */}
                        <td className="px-4 py-3" style={{ minWidth: "90px" }}>
                          <select
                            value={isEditing ? editState!.status : lead.status}
                            onChange={(e) => {
                              if (isEditing) {
                                setEditState((s) => s && { ...s, status: e.target.value });
                              } else {
                                handleStatusChange(lead.id, e.target.value);
                              }
                            }}
                            className="rounded-full px-2.5 py-1 text-xs font-semibold outline-none"
                            style={{
                              backgroundColor: "#F5EFE6",
                              border: "none",
                              color: STATUS_COLORS[isEditing ? editState!.status : lead.status] ?? "var(--foreground)",
                              cursor: "pointer",
                            }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 제출일 */}
                        <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)", minWidth: "90px" }}>
                          {new Date(lead.created_at).toLocaleDateString("ko-KR")}
                        </td>

                        {/* 액션 */}
                        <td className="px-4 py-3" style={{ minWidth: "120px" }}>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(lead.id)}
                                  disabled={saving}
                                  className="rounded px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                                  style={{ backgroundColor: "var(--accent)" }}
                                >
                                  {saving ? "저장중" : "저장"}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="rounded px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-70"
                                  style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                                >
                                  취소
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(lead)}
                                  className="rounded px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-70"
                                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDelete(lead.id)}
                                  disabled={deletingId === lead.id}
                                  className="rounded px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                                  style={{ backgroundColor: "#C0392B" }}
                                >
                                  {deletingId === lead.id ? "삭제중" : "삭제"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
