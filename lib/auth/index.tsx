"use client";

import { createContext, useContext, ReactNode } from "react";
import { Admin, User } from "@/lib/db/schema";

type UserContextType = {
  userPromise: Promise<User | null>;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  );
}
/******************************* admin *****************************/
type AdminContextType = {
  adminPromise: Promise<Admin | null>;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin(): AdminContextType {
  let context = useContext(AdminContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function AdminProvider({
  children,
  adminPromise,
}: {
  children: ReactNode;
  adminPromise: Promise<Admin | null>;
}) {
  return (
    <AdminContext.Provider value={{ adminPromise }}>
      {children}
    </AdminContext.Provider>
  );
}
