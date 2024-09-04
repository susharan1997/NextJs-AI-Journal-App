'use client';
import { askQuestion } from '@/utils/api';
import React, { useState } from 'react';
import styled from 'styled-components';
import JournalContentSpinner from './JournalContentSpinner';

const Form = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 30px 0;
    height: 50px;
`;

const InputContainer = styled.input`
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: 5px;

    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
  background-color: #61bbf2;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 2px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0769a6;
  }
`;

const QaContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const AnswerContainer = styled.div`
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-y: auto;
    border-radius: 1em;
`;

const TextSpinnerContainer = styled(JournalContentSpinner)`
    top: 45%;
    left: 55%;
    position: absolute;
`;

const TextPara = styled.p`
    text-align: justify;
    text-justify: inter-word;
    background-color: white;
    border-radius: 1em;
    padding: 10px;
`;

const Question = () => {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setAnswer('');

        try {
            const { data } = await askQuestion(question);
            if (data) {
                setAnswer(data);
            }
            else {
                console.error('Something went wrong!', data);
            }
        }
        catch (error) {
            console.error('Error while fetching the questions!', error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <QaContainer>
            <Form onSubmit={handleSubmit}>
                <InputContainer type='text' onChange={(e) => setQuestion(e.target.value)} value={question} disabled={loading} placeholder='Ask a question related to a journal...' />
                <Button type='submit' disabled={loading} >Ask</Button>
            </Form>
            <AnswerContainer>
                {(loading || answer) && (
                    <>
                        {loading ? (
                            <TextSpinnerContainer>
                                <JournalContentSpinner />
                            </TextSpinnerContainer>
                        ) : (
                            <TextPara>{answer}</TextPara>
                        )}
                    </>
                )}
            </AnswerContainer>
        </QaContainer>
    )
}

export default Question;