"use client";
import JournalEditor from "@/components/JournalEditor";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { userDataType } from "@/types";
import { EntryAnalysisType } from "@/types";
import useUserStore from "@/store/useStore";

interface paramsType {
  id: string;
}

const JournalPageComponent: NextPage<{ params: paramsType }> = ({ params }) => {
  const [entryAnalysis, setEntryAnalysis] = useState<EntryAnalysisType | null>(
    null
  );
  const userData = useUserStore((state) => state.getUser());
  
  const refreshJournal = async () => {
    const journalId = params?.id;
    if (userData && journalId) {
      const fetchEntry = async () => {
        try {
          const response = await fetch(`/api/journal-entry/${journalId}`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData.id),
          });
          const { entryAnalysis } = await response.json();
          setEntryAnalysis(entryAnalysis);
        } catch (error) {
          console.error("Error fetching journal entries:", error);
        }
      };
      fetchEntry();
    }
  }

  useEffect(() => {
    refreshJournal();
  }, [userData, params]);

  return (
    <div>
      <JournalEditor journal={entryAnalysis} refreshJournal={refreshJournal} />
    </div>
  );
};

export default JournalPageComponent;
