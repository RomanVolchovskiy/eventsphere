import { redirect } from "next/navigation";

// Кабінет переїхав на персональну сторінку /me (вкладка «Мої свята»).
// Роут лишається, щоб старі посилання й закладки не ламались.
export default function DashboardRedirect() {
  redirect("/me?tab=client");
}
