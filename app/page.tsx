"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setPending(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      const { error } = await res.json();
      alert(error ?? "오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  if (submitted) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F5EFE6" }}
          >
            <svg
              className="h-8 w-8"
              style={{ color: "var(--accent)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2
            className="mb-3 text-2xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            문의가 접수되었습니다
          </h2>
          <p className="mb-8 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            영업일 기준 2일 이내에 연락드리겠습니다.
          </p>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setSubmitted(false);
            }}
            className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            새로운 문의하기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* 히어로 섹션 */}
      <section
        className="flex flex-col items-center justify-center px-4 py-24 text-center"
        style={{ backgroundColor: "#F5EFE6" }}
      >
        <p
          className="mb-4 text-sm font-medium uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          SNS 마케팅 파트너
        </p>
        <h1
          className="mb-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          style={{ color: "var(--foreground)" }}
        >
          plock에 SNS 마케팅
          <br />
          의뢰하기
        </h1>
        <p
          className="max-w-md text-base leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          브랜드의 SNS 채널 운영부터 광고 집행까지,
          <br />
          plock이 함께합니다.
        </p>
        <a
          href="#form"
          className="mt-8 inline-block rounded-full px-7 py-3 text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "var(--accent)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent)")
          }
        >
          지금 문의하기 →
        </a>
      </section>

      {/* 폼 섹션 */}
      <section
        id="form"
        className="flex flex-1 items-start justify-center px-4 py-16"
      >
      <div className="w-full max-w-lg">
        {/* 폼 헤더 */}
        <div className="mb-10 text-center">
          <h2
            className="mb-2 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            문의하기
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            아래 양식을 작성해 주시면 빠르게 연락드리겠습니다.
          </p>
        </div>

        {/* 폼 카드 */}
        <div
          className="rounded-2xl p-8 shadow-sm"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이름 */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                이름 <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                이메일 <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@company.com"
                value={formData.email}
                onChange={handleChange}
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            {/* 회사명 */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="company"
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                회사명 <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                placeholder="(주)회사명"
                value={formData.company}
                onChange={handleChange}
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            {/* 전화번호 */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                전화번호
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            {/* 문의 내용 */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                문의 내용 <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="문의 내용을 자유롭게 작성해 주세요."
                value={formData.message}
                onChange={handleChange}
                className="resize-none rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-lg py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "var(--accent)",
                color: "#FFFFFF",
                border: "none",
              }}
              onMouseEnter={(e) => {
                if (!pending)
                  e.currentTarget.style.backgroundColor = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
              }}
            >
              {pending ? "제출 중..." : "문의하기"}
            </button>
          </form>
        </div>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span style={{ color: "var(--accent)" }}>*</span> 표시는 필수 입력
          항목입니다.
        </p>
      </div>
      </section>
    </main>
  );
}
