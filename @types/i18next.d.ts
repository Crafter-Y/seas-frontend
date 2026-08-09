import { defaultNS, resources } from "@/helpers/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["de"];
  }
}
