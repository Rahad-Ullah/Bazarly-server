import { v4 as uuid } from "uuid";

export const generateTrxId = (): string => {
  return uuid().replace(/-/g, "").substring(0, 10).toUpperCase();
};
