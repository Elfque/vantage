import { signOut } from "next-auth/react";

export const handleLogOut = async () => {
  await signOut();
  window.location.replace("/auth");
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};
