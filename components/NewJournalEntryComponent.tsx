"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { newEntry } from "@/utils/api";
import useUserStore from "@/store/useStore";

const Container = styled.div`
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  width: 150px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  font-family: "Merriweather", Georgia, serif;
`;

const Content = styled.div`
  padding: 1.25rem;
  transition: background-color 0.3s ease;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  &: hover {
    background-color: #e9ecef;
  }
`;

const Title = styled.span`
  font-size: 1.2rem;
`;

const NewJournalEntryComponent = () => {
  const router = useRouter();
  const userData = useUserStore((state) => state.getUser());

  const handleOnClick = async () => {
    if (!userData) {
      console.log("User data not available");
      return;
    }

    try {
      const data = await newEntry(userData.id);
      if (data?._id) {
        console.log(data?._id, 'NEW ENTRY ID');
        router.push(`/journal/${data._id}`);
      } else {
        console.log(`Invalid data response: ${data}`);
        throw new Error("Invalid data response!");
      }
    } catch (error) {
      console.error(`Error creating new entry: ${error}`);
    }
  };

  return (
    <Container onClick={handleOnClick}>
      <Content>
        <Title>New Entry</Title>
      </Content>
    </Container>
  );
};

export default NewJournalEntryComponent;
