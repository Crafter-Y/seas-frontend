import { defaultNS, resources } from "@/helpers/i18n";

// TODO: this does not seem to work. maybe it is just my fault or some misconfiguration in my IDE.
// rn, just achieve "the same" functionality by just setting the type in my CustomText component
declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources["de"];
    }
}