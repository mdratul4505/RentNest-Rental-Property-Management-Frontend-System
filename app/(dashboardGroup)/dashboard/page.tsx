import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";

export default async function DashboardRootPage() {
  const userRes = await getMe();

  if (!userRes.success || !userRes.data?.user) {
    redirect("/auth/login");
  }

  const role = userRes.data.user.role?.toUpperCase();

  if (role === "LANDLORD") {
    redirect("/dashboard/landlord");
  } else if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/tenant");
  }
}
