'use client';
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import QaDropdownComponent from "@/components/QaDropdownComponent";
import JournalContentSpinner from "@/components/JournalContentSpinner";
import { QaType } from "../../../types";
import { userDataType } from "../../../types";

const QuestionsContainer = styled.div`
  width: 100%;
  min-height: 400px;
  border: 5px solid #61bbf2;
  border-radius: 0.8em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Text = styled.span`
    font-weight: bold;
    font-size: 25px;
    text-decoration: underline;
`;

const EmptyText = styled.span`
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 17%;
`;

const TextSpinnerContainer = styled(JournalContentSpinner)`
    top: 45%;
    left: 55%;
    position: absolute;
`;

const PreviousQuestions: React.FC = () => {
    const [qaData, setQaData] = useState<QaType[]>([]);
    const [userData, setUserData] = useState<userDataType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setUserData(parsedUser);
        }
    }, []);

    useEffect(() => {
        const fetchQa = async () => {
            if (userData && userData.id) {
                try {
                    const response = await fetch(`/api/previous-qa`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({ userId: userData.id })
                    });
                    const { data } = await response.json();
                    if(data){
                        setQaData(data);
                    }
                    else{
                        console.log('Invalid QA data!', data);
                    }
                } catch (error) {
                    console.error('Error fetching previous questions:', error);
                }
                finally{
                    setLoading(false);
                }
            }
        };

        fetchQa();
    }, [userData]);

    return (
        <QuestionsContainer>
            <Text>
                Previously asked questions:-
            </Text>
            {loading ? (
                <TextSpinnerContainer>
                    <JournalContentSpinner />
                </TextSpinnerContainer>
            ) : (
                !qaData.length ? (
                    <EmptyText>
                        No Questions found!
                    </EmptyText>
                ) : (
                    <QaDropdownComponent data={qaData} />
                )
            )}
        </QuestionsContainer>
    )
}

export default PreviousQuestions;