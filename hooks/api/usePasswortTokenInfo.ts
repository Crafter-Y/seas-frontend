import { useState } from "react";
import { requestApiWithoutCredentials } from "@/helpers/api";

export default function usePasswordTokenInfo() {
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [productName, setProductName] = useState("");
    const [productId, setProductId] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");

    const verify = async (token: string) => {
        const res = await requestApiWithoutCredentials(`users/passwordTokenInfo/${token}`, "GET");

        if (res == null || !res.success) {
            setTokenValid(false);
            return;
        }

        setProductName(res.data.productName);
        setProductId(res.data.productId);
        setFirstname(res.data.firstname);
        setLastname(res.data.lastname);
        setEmail(res.data.email);

        setTokenValid(true);
    };

    return { verify, tokenValid, setTokenValid, productName, productId, firstname, lastname, email };
}
