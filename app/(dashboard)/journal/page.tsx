"use client";
import Banner from "@/components/Banner";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import NewJournalEntryComponent from "@/components/NewJournalEntryComponent";
import JournalEntryCard from "@/components/JournalEntryCard";
import styled from "styled-components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Question from "../../../components/Question";
import { useRouter } from "next/navigation";
import JournalContentSpinner from "../../../components/JournalContentSpinner";
import { userDataType, JournalEntryAnalysisType } from "@/types";
import useUserStore from "../../../store/useStore";
import SearchComponent from "../../../components/SearchComponent";
import { isoStringFormat } from "@/utils/useFormattedData";

const JournalsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  overflow-y: auto;
  width: 100%;
  max-height: 50dvh;
  border: 1px solid grey;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.9);
  border-radius: 0.5rem;
  background-color: #282c34;
  font-family: "Merriweather", Georgia, serif;
`;

const Title = styled.h2`
  font-size: 1.6em;
  padding: 10px;
  border-bottom: 2px solid black;
  text-align: center;
  text-align: start;
`;

const StyledJournalContentSpinner = styled(JournalContentSpinner)`
  position: absolute;
  top: 50%;
  left: 55%;
`;

const JournalPageContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const EmptyJournalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.span`
  font-size: 2rem;
  color: white;
`;

function JournalComponent() {
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [entries, setEntries] = useState<JournalEntryAnalysisType[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<
    JournalEntryAnalysisType[] | null
  >(null);
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [emptyMsg, setEmptyMsg] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(-10);
  const [emotionType, setEmotionType] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    const deletedId = searchParams.get("deleted");
    if (deletedId) {
      setMessage(`Deleted the journal (${deletedId} successfully!)`);
      setShowBanner(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("deleted");
      router.replace(url.toString(), undefined);
      setTimeout(() => setShowBanner(false), 3000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      setUserData(parsedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (userData) {
        try {
          const response = await fetch(`/api/journal-entries`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData.id),
          });
          const data = await response.json();
          setEntries(data.entries);
        } catch (error) {
          console.error("Error fetching journal entries:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEntries();

    const hasShownBanner = localStorage.getItem("hasShownBanner");
    if (userData && !hasShownBanner) {
      const msg = `Welcome ${userData.name}`;
      setMessage(msg);
      setShowBanner(true);
      localStorage.setItem("hasShownBanner", "true");
      setTimeout(() => setShowBanner(false), 3000);
    }
  }, [userData, setEntries]);

  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const date = value ? new Date(value) : null;

    if (id === "start-date") setStartDate(date);
    else if (id === "end-date") setEndDate(date);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stripTime = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const filteredEntries = entries?.filter((entry, index) => {
      const entryDate = stripTime(new Date(entry.createdAt));
      const isWithinDateRange =
        startDate && !endDate
          ? entryDate >= stripTime(startDate)
          : startDate && endDate
          ? entryDate >= stripTime(startDate) && entryDate <= stripTime(endDate)
          : true;

      const isWithinScore =
        selectedScore !== null &&
        selectedScore !== undefined &&
        entry?.analysis?.sentimentScore
          ? entry?.analysis?.sentimentScore >= selectedScore
          : true;

      const isMatchingEmotion =
        emotionType && entry?.analysis?.mood
          ? entry?.analysis?.mood.toLowerCase() === emotionType.toLowerCase()
          : true;

      return [isWithinDateRange && isMatchingEmotion && isWithinScore].every(
        Boolean
      );
    });

    if (filteredEntries && filteredEntries.length > 0) {
      setFilteredEntries(filteredEntries);
      setEmptyMsg(false);
    } else {
      setFilteredEntries([]);
      setEmptyMsg(true);
    }
  };

  const handleClear = () => {
    setShowBanner(false);
    setStartDate(null);
    setEndDate(null);
    setFilteredEntries(null);
    setEmptyMsg(false);
    setEmotionType("");
    setSelectedScore(-10);
  };

  const handleSlider = (e: any) => {
    setSelectedScore(Number(e.target.value));
  };
  const handleEmotionSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setEmotionType(e.target.value);
  };

  if (loading) {
    return (
      <StyledJournalContentSpinner>
        <JournalContentSpinner />
      </StyledJournalContentSpinner>
    );
  }

  return (
    <JournalPageContainer>
      <Banner message={message || ""} show={showBanner} />
      <Title>Journals</Title>
      <Question />
      <NewJournalEntryComponent />
      <SearchComponent
        journal={entries}
        handleDate={handleDate}
        handleClear={handleClear}
        handleSlider={handleSlider}
        handleSearch={(e) => handleSearch(e)}
        handleEmotionSelect={(e) => handleEmotionSelect(e)}
        startDate={startDate ? isoStringFormat(startDate) : ""}
        endDate={endDate ? isoStringFormat(endDate) : ""}
        selectedScore={selectedScore}
        emotionType={emotionType}
      />
      <JournalsContainer>
        {emptyMsg ? (
          <EmptyJournalContainer>
            <EmptyText>No Journal entries found</EmptyText>
          </EmptyJournalContainer>
        ) : (
          (filteredEntries || entries)?.map(
            (journal: JournalEntryAnalysisType, index: number) => (
              <Link
                href={`/journal/${journal?._id}`}
                key={journal?._id}
                passHref
              >
                <JournalEntryCard key={index} entry={journal} />
              </Link>
            )
          )
        )}
      </JournalsContainer>
    </JournalPageContainer>
  );
}

export default JournalComponent;
