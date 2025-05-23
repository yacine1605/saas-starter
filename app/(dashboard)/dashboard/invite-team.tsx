"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { use, useActionState, useEffect } from "react";
import { inviteTeamMember } from "@/app/(login)/actions";
import { useUser } from "@/lib/auth";
import { toast } from "sonner";

type ActionState = {
  error?: string;
  success?: string;
};

export function InviteTeamMember() {
  const { userPromise } = useUser();
  const user = use(userPromise);
  // const isOwner = user?.role === 'owner';
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, { error: "", success: "" });
  useEffect(() => {
    if (inviteState.error) {
      toast(`${inviteState.error}`, {
        action: {
          label: "fermer",
          onClick: () => {},
        },
      });
    }
  }, [inviteState.error]);

  useEffect(() => {
    if (inviteState.success) {
      toast(`${inviteState.success}`, {
        action: {
          label: "fermer",
          onClick: () => {},
        },
      });
    }
  }, [inviteState.success]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de paiement du facture</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label
              htmlFor="num_avis"
              className="block text-sm font-medium text-gray-700"
            >
              Numéro d'avis
            </Label>
            <div className="mt-1">
              <Input
                id="num_avis"
                name="num_avis"
                type="num_avis"
                //autoComplete="code_client"
                //defaultValue={state.code_client}
                maxLength={9}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                placeholder="Entrez votre numéro d'avis"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="montant"
              className="block text-sm font-medium text-gray-700"
            >
              Montant
            </Label>
            <div className="mt-1">
              <Input
                id="montant"
                name="montant"
                type="number"
                step="0.01"
                //autoComplete="code_client"
                //defaultValue={state.code_client}
                maxLength={10}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 "
                placeholder="Entrez votre le montant de la facture "
              />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            // disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Demande de payment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
