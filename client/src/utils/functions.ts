import { signOut } from "next-auth/react";

export const handleLogOut = async () => {
  await signOut();
  window.location.replace("/auth");
};
