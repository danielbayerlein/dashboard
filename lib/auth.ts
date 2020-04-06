import { Base64 } from "js-base64";
import auth from "../auth";
import { IAuthModel } from "./auth-model";

export const basicAuthHeader = (key: string) => {
  const credentials: IAuthModel = auth[key];

  if (credentials) {
    const credential: string = Base64.encode(
      `${credentials.username}:${credentials.password}`
    );
    return { Authorization: `Basic ${credential}` };
  }

  throw new ReferenceError(`No credentials found with key '${key}' in auth.js`);
};
