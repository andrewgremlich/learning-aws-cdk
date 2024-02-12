import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

export class JsonError extends Error {}

export function validateAsSpaceEntry(args: any) {
  if ((args as SpaceEntry).location === undefined) {
    throw new MissingFieldError("Location");
  }
  if ((args as SpaceEntry).name === undefined) {
    throw new MissingFieldError("name");
  }
  if ((args as SpaceEntry).continent === undefined) {
    throw new MissingFieldError("continent");
  }
}
