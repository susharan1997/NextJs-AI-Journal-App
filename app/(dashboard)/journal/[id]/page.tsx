"use client";
import JournalEditor from "@/components/JournalEditor";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { EntryAnalysisType } from "@/types";
import useUserStore from "@/store/useStore";

interface paramsType {
  id: string;
}

const JournalPageComponent: NextPage<{ params: paramsType }> = ({ params }) => {
  const setJournalId = useUserStore((state) => state.setJournalId);

  useEffect(() => {
    if (params?.id) setJournalId(params?.id);
  }, [params]);

  return (
    <div>
      <JournalEditor />
    </div>
  );
};

export default JournalPageComponent;
