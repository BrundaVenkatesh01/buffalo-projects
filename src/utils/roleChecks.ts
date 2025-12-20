import type { User } from "@/services/firebaseAuth";

export const isMentorUser = (user?: Pick<User, "isMentor"> | null): boolean => {
  return Boolean(user?.isMentor);
};

export const requireMentor = (user?: Pick<User, "isMentor"> | null): void => {
  if (!isMentorUser(user)) {
    throw new Error("Mentor access required");
  }
};
