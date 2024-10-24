import { JournalEntryAnalysisType } from "@/types";
import React from "react";
import styled from "styled-components";

interface SearchComponentProps {
  journal: JournalEntryAnalysisType[] | null;
  startDate: string;
  endDate: string;
  selectedScore: number | null;
  emotionType: string;
  handleSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEmotionSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchContainer = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 30px;
  padding-inline: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;
`;

const StyledInputDate = styled.input`
  width: 250px;
  height: 40px;
  border: 2px solid black;
  border-radius: 5px;
`;

const SearchButton = styled.button`
  width: 100px;
  height: 40px;
  background-color: #61bbf2;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0769a6;
  }
`;

const ClearButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: white;
  color: black;
  font-size: 0.7rem;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const StyledSlider = styled.input`
  width: 200px;
`;

const StyledEmotionSelect = styled.select`
  width: 250px;
  height: 40px;
  border: 2px solid #61bbf2;
  padding-inline: 10px;
  border-radius: 0.4em;
`;

const SearchComponent: React.FC<SearchComponentProps> = ({
  journal,
  handleDate,
  handleClear,
  handleSearch,
  handleSlider,
  handleEmotionSelect,
  startDate,
  endDate,
  selectedScore,
  emotionType,
}) => {
  if (!journal) {
    console.log("Invalid journal entries encountered!:", journal);
  }

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSearch}>
        <StyledInputDate
          id="start-date"
          type="date"
          value={startDate}
          placeholder="Enter the start date"
          onChange={handleDate}
        />
        <StyledInputDate
          id="end-date"
          type="date"
          value={endDate}
          placeholder="Enter the end date"
          onChange={handleDate}
        />
        <StyledSlider
          id="score-slider"
          type="range"
          min="-10"
          max="10"
          onChange={handleSlider}
          value={selectedScore!}
        />
        <StyledEmotionSelect
          id="emotion-select"
          value={emotionType}
          onChange={handleEmotionSelect}
        >
          <option value="">Select Emotion Category</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="mixed emotions">Mixed Emotions</option>
          <option value="exhausted">Exhausted</option>
          <option value="others">Others</option>
        </StyledEmotionSelect>
        <SearchButton type="submit">Search</SearchButton>
        <ClearButton id="clear-btn" onClick={handleClear}>
          Clear
        </ClearButton>
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchComponent;
