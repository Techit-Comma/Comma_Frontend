import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import HandleWithdraws from "./component/HandleWithdraws";
import { Box } from "@mui/material";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">출금 처리 페이지</h1>
        </div>
      </Header>
      <Box sx={{ minWidth: 800, width: "50%" }}>
        <HandleWithdraws />
      </Box>
    </div>
  );
}
