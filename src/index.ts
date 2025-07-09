

import { ClientExtend } from "./structure/Client";
import { WebManager } from "./handlers/web";
import { config } from "dotenv";
config();

export const client = new ClientExtend();
export const server = WebManager;

