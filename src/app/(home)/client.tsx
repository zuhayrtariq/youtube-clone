"use client";
import { trpc } from "@/trpc/client";
import React from "react";

const ClientPage = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Zuhayr",
  });
  return <div>ClientPage : {data.greeting}</div>;
};

export default ClientPage;
