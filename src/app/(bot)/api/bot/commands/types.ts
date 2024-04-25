import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";

export interface Params {
  user: { email: string };
  interaction: APIChatInputApplicationCommandInteraction;
}
