import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import ClientPage from "./client";
import { ErrorBoundary } from "react-error-boundary";
const HomePage = async () => {
  void trpc.hello.prefetch({ text: "Zuhayr" });
  return (
    <div>
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error</p>}>
            <ClientPage />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default HomePage;
