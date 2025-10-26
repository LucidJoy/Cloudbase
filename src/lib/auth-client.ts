import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";

const client = createAuthClient({
  plugins: [polarClient(), multiSessionClient()],
});

export const authClient = client;
export const { useSession } = client;
