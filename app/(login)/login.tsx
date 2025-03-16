"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === "signin"
            ? "Se connecter à votre compte"
            : "Créer un compte"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {mode === "signin" ? (
          <form className="space-y-6" action={formAction}>
            <Input type="hidden" name="redirect" value={redirect || ""} />

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  //required
                  maxLength={50}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Enter votre email"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={state.password}
                  //required
                  minLength={8}
                  maxLength={100}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Enter votre mot de passe "
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md
               shadow-sm text-sm font-medium text-white bg-black hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  "Connecter"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" action={formAction}>
            <Input type="hidden" name="redirect" value={redirect || ""} />
            <div>
              <Label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom Complet
              </Label>
              <div className="mt-1">
                <Input
                  id="nom"
                  name="nom"
                  type="nom"
                  //autoComplete="nom"
                  defaultValue={state.nom}
                  maxLength={50}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Entrez votre nom et prénom"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="adresse"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse
              </Label>
              <div className="mt-1">
                <Input
                  id="adresse"
                  name="adresse"
                  type="adresse"
                  autoComplete="adresse"
                  defaultValue={state.adresse}
                  maxLength={50}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Entrez votre adresse"
                />
              </div>
            </div>
            <div className="flex flex-1 gap-5">
              <div className=" flex-grow">
                <Label
                  htmlFor="commune"
                  className="block text-sm font-medium text-gray-700"
                >
                  Commune
                </Label>
                <div className="mt-1">
                  <Input
                    id="commune"
                    name="commune"
                    type="commune"
                    autoComplete="commune"
                    defaultValue={state.commune}
                    maxLength={50}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                    placeholder="Entrez votre commune"
                  />
                </div>
              </div>
              <div className=" flex-grow">
                <Label
                  htmlFor="Ilot"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ilot
                </Label>
                <div className="mt-1">
                  <Input
                    id="ilot"
                    name="ilot"
                    type="ilot"
                    autoComplete="ilot"
                    defaultValue={state.ilot}
                    maxLength={50}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                    placeholder="Entrez votre ilot"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  maxLength={50}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Enter votre email"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="tel"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de Téléphone
              </Label>
              <div className="mt-1">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="phone"
                  defaultValue={state.phone}
                  maxLength={10}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Entrez votre numéro de téléphone Ex: 0* ** ** ** **"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="code_client"
                className="block text-sm font-medium text-gray-700"
              >
                Code client
              </Label>
              <div className="mt-1">
                <Input
                  id="code_client"
                  name="code_client"
                  type="code_client"
                  //autoComplete="code_client"
                  defaultValue={state.code_client}
                  maxLength={9}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Entrez votre numéro de téléphone Ex: 0* ** ** ** **"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={state.password}
                  minLength={8}
                  maxLength={100}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                  placeholder="Enter votre mot de passe "
                />
              </div>
            </div>
            {state?.error && (
              <div className="text-red-500 text-sm">{state.error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md
               shadow-sm text-sm font-medium text-white bg-black hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  "Confimer"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === "signin"
                  ? "Nouveau sur notre plateforme ?"
                  : "Vous avez déjà un compte ?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === "signin" ? "/sign-up" : "/sign-in"}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === "signin"
                ? "Créer un compte"
                : "Se connecter à votre compte"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
