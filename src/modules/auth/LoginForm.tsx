"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  IconAlertCircle,
  IconArrowUpRight,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const { login, status } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await login({
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!result.success) {
      setError("认证失败，请检查用户名或密码后重试。");
      setIsSubmitting(false);
    }
  }

  const isDisabled = isSubmitting || status === "loading";

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#9db0bf]"
        >
          <span className="h-1 w-1 rounded-full bg-[#b9cad6]" aria-hidden="true" />
          用户名
        </label>
        <div className="group flex h-13 items-center rounded-[5px] border border-[#9db1c0]/45 bg-[#071522]/55 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition-colors focus-within:border-[#d5e0e8] focus-within:bg-[#071522]/75">
          <IconUser
            size={18}
            stroke={1.5}
            className="mr-3.5 flex-none text-[#8198a9] transition-colors group-focus-within:text-[#d5e0e8]"
            aria-hidden="true"
          />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            required
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#edf3f7] outline-none placeholder:text-[#718797]"
            placeholder="请输入用户名"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#9db0bf]"
        >
          <span className="h-1 w-1 rounded-full bg-[#b9cad6]" aria-hidden="true" />
          密码
        </label>
        <div className="group flex h-13 items-center rounded-[5px] border border-[#9db1c0]/45 bg-[#071522]/55 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition-colors focus-within:border-[#d5e0e8] focus-within:bg-[#071522]/75">
          <IconLock
            size={18}
            stroke={1.5}
            className="mr-3.5 flex-none text-[#8198a9] transition-colors group-focus-within:text-[#d5e0e8]"
            aria-hidden="true"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#edf3f7] outline-none placeholder:text-[#718797]"
            placeholder="请输入密码"
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-[5px] border border-red-400/30 bg-red-500/[0.08] px-3.5 py-3 text-[12px] leading-5 text-red-200"
        >
          <IconAlertCircle size={17} stroke={1.65} className="mt-0.5 flex-none text-red-300" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isDisabled}
        className="group relative flex h-13 w-full items-center justify-between overflow-hidden rounded-[5px] border border-white/75 bg-[linear-gradient(180deg,#e7edf2,#aebdc8)] px-5 text-[13px] font-semibold tracking-[0.12em] text-[#0a1a28] shadow-[0_12px_28px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] transition duration-200 hover:-translate-y-px hover:brightness-105 disabled:cursor-wait disabled:opacity-55"
      >
        <span className="relative">{isSubmitting ? "正在验证身份" : "进入控制台"}</span>
        <span className="relative grid h-7 w-7 place-items-center rounded-[4px] border border-[#506577]/25 bg-[#173047]/[0.08] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <IconArrowUpRight size={17} stroke={1.8} aria-hidden="true" />
        </span>
      </button>
    </form>
  );
}
