import serverless from "serverless-http";
import { createServer } from "../docs/server";

export const handler = serverless(createServer());
