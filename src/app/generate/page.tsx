"use client";

import React from "react";
import ImageGenerator from "../components/ImageGenerator";
import AppLayout from "../AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const Page: React.FC = () => {
  return (
    <AppLayout>
      <ProtectedRoute>
        <ImageGenerator />
      </ProtectedRoute>
    </AppLayout>
  );
};

export default Page;
