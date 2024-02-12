import { JsonError } from "./Validator";

export function parseJson(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JsonError("Invalid JSON!");
  }
}
