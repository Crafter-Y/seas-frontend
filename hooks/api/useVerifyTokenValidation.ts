import { useState } from "react";

import { requestApiWithoutCredentials } from "@/helpers/api";

export default function useVerifyTokenValidation() {
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [productName, setProductName] = useState("");

  const verify = async (token: string) => {
    const res = await requestApiWithoutCredentials(
      `users/redeemVerificationToken/${token}`,
      "GET",
    );

    if (res === null || !res.success) {
      setTokenValid(false);
      return;
    }

    setProductName(res.data.product.name);

    setTokenValid(true);
  };

  return { verify, tokenValid, setTokenValid, productName };
}
