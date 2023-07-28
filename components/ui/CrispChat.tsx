"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("db4cb580-2ad4-4eb0-8bc8-4c4ab1205c9f");
  });

  return null;
}

export default CrispChat;