import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAAR_ACCESS_TOKEN,
  server: "sandbox",
});
