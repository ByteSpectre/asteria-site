"use client";

import { useActionState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import {
  createAdminAction,
  deleteAdminAction,
  updateAdminAction,
  type AdminFormState,
} from "@/app/admin/(panel)/admins/actions";

const initialState: AdminFormState = { refresh: 0 };

const inputClass =
  "h-12 w-full border border-ink/15 bg-transparent px-4 text-sm outline-none transition-colors focus:border-ink/40";
const labelClass = "mb-2 block text-[10px] uppercase tracking-[0.09em] text-ink/45";

type AdminRow = {
  id: string;
  login: string;
  createdAt: string;
};

function FormMessage({ state, okText }: { state: AdminFormState; okText: string }) {
  if (state.error) {
    return (
      <p role="alert" className="border-l-2 border-wine pl-3 text-xs leading-relaxed text-wine">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return <p className="text-xs text-ink/45">{okText}</p>;
  }
  return null;
}

function AdminRowCard({
  admin,
  isSelf,
  isOnly,
}: {
  admin: AdminRow;
  isSelf: boolean;
  isOnly: boolean;
}) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAdminAction.bind(null, admin.id),
    initialState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAdminAction.bind(null, admin.id),
    initialState,
  );

  return (
    <li className="border border-ink/10 bg-ivory">
      <form
        key={updateState.refresh}
        action={updateFormAction}
        className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
      >
        <label className="block">
          <span className={labelClass}>
            Логин {isSelf ? <span className="text-wine">· это вы</span> : null}
          </span>
          <input
            name="login"
            type="text"
            required
            minLength={3}
            maxLength={64}
            defaultValue={admin.login}
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Новый пароль (необязательно)</span>
          <input
            name="password"
            type="password"
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            placeholder="Оставьте пустым, чтобы не менять"
            className={inputClass}
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updatePending}
            className="h-12 border border-ink/15 px-5 text-[11px] uppercase tracking-[0.08em] text-ink/60 transition-colors hover:border-wine hover:text-wine disabled:opacity-50"
          >
            {updatePending ? "Сохраняем…" : "Сохранить"}
          </button>
          <button
            type="submit"
            formAction={deleteFormAction}
            disabled={isSelf || isOnly || deletePending}
            onClick={(event) => {
              if (!window.confirm(`Удалить администратора ${admin.login}?`)) {
                event.preventDefault();
              }
            }}
            aria-label={`Удалить ${admin.login}`}
            title={isSelf ? "Нельзя удалить себя" : isOnly ? "Нельзя удалить последнего администратора" : "Удалить"}
            className="flex h-12 w-12 items-center justify-center border border-ink/15 text-ink/40 transition-colors hover:border-wine hover:text-wine disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        </div>
        <div className="sm:col-span-3">
          <FormMessage
            state={updateState.error || updateState.ok ? updateState : deleteState}
            okText={
              isSelf
                ? "Сохранено."
                : "Сохранено. Сеансы этого администратора завершены."
            }
          />
          <p className="mt-2 text-[10px] uppercase tracking-[0.09em] text-ink/28">
            Добавлен {admin.createdAt}
            {isSelf
              ? " · при смене логина или пароля вы выйдете из панели"
              : " · при смене логина или пароля его сеансы завершатся"}
          </p>
        </div>
      </form>
    </li>
  );
}

export function AdminUsersManager({
  admins,
  currentId,
}: {
  admins: AdminRow[];
  currentId: string;
}) {
  const [createState, createFormAction, createPending] = useActionState(
    createAdminAction,
    initialState,
  );

  return (
    <div className="mt-10 space-y-10">
      <section className="border border-ink/10 bg-ivory p-5 sm:p-7">
        <h2 className="flex items-center gap-3 text-lg tracking-[-0.02em]">
          <UserPlus size={17} strokeWidth={1.5} className="text-wine" aria-hidden="true" />
          Добавить администратора
        </h2>
        <form
          key={createState.refresh}
          action={createFormAction}
          className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
        >
          <label className="block">
            <span className={labelClass}>Логин</span>
            <input
              name="login"
              type="text"
              required
              minLength={3}
              maxLength={64}
              autoComplete="off"
              placeholder="name@asteria.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Пароль</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="Минимум 8 символов"
              className={inputClass}
            />
          </label>
          <button
            type="submit"
            disabled={createPending}
            className="h-12 bg-wine px-6 text-[11px] uppercase tracking-[0.08em] text-ivory transition-colors hover:bg-wine-deep disabled:opacity-50"
          >
            {createPending ? "Создаём…" : "Создать"}
          </button>
          <div className="sm:col-span-3">
            <FormMessage state={createState} okText="Администратор создан." />
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-lg tracking-[-0.02em]">Учётные записи</h2>
        <ul className="mt-5 space-y-4">
          {admins.map((admin) => (
            <AdminRowCard
              key={admin.id}
              admin={admin}
              isSelf={admin.id === currentId}
              isOnly={admins.length <= 1}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
