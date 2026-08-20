"use client";

import { useActionState, useState } from "react";
import { RefreshCw } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { refresh: 1 };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [captchaVersion, setCaptchaVersion] = useState(1);
  const captchaKey = state.refresh + captchaVersion;

  return (
    <form action={action} className="mt-10 space-y-6">
      <label className="block">
        <span className="mb-2 block text-[10px] uppercase tracking-[0.09em] text-ink/45">Логин</span>
        <input name="login" type="text" autoComplete="username" required className="h-13 w-full border border-ink/15 bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink/15 focus-visible:outline-none focus-visible:ring-0" />
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] uppercase tracking-[0.09em] text-ink/45">Пароль</span>
        <input name="password" type="password" autoComplete="current-password" required className="h-13 w-full border border-ink/15 bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink/15 focus-visible:outline-none focus-visible:ring-0" />
      </label>
      <div>
        <span className="mb-2 block text-[10px] uppercase tracking-[0.09em] text-ink/45">Проверочный код</span>
        <div className="grid grid-cols-[minmax(0,1fr)_190px_44px] gap-2">
          <input name="captcha" inputMode="text" autoComplete="off" maxLength={5} required aria-label="Код с изображения" className="h-16 min-w-0 border border-ink/15 bg-transparent px-4 text-center text-lg uppercase tracking-[0.18em] outline-none focus:border-ink/15 focus-visible:outline-none focus-visible:ring-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={captchaKey} src={`/api/captcha?v=${captchaKey}${captchaVersion > 1 ? "&fresh=1" : ""}`} alt="Проверочный код" width={190} height={64} className="h-16 w-[190px] border border-ink/10 object-cover" />
          <button type="button" onClick={() => setCaptchaVersion((value) => value + 1)} aria-label="Обновить код" className="flex h-16 items-center justify-center border border-ink/15 text-ink/45 transition-colors hover:border-wine hover:text-wine">
            <RefreshCw size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      {state.error ? <p role="alert" className="border-l-2 border-wine pl-3 text-xs leading-relaxed text-wine">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="flex h-13 w-full items-center justify-between bg-wine px-5 text-[11px] uppercase tracking-[0.08em] text-ivory transition-colors hover:bg-wine-deep disabled:opacity-55">
        <span>{pending ? "Проверяем…" : "Войти"}</span><span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
