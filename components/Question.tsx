'use client';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import JournalContentSpinner from './JournalContentSpinner';
import { useQuestionAnswer } from '@/utils/useQuestionAnswer';
import useUserStore from '@/store/useStore';
import EditorBanner from './EditorBanner';

const Form = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 30px 0;
    height: 50px;
    font-family: 'Merriweather', Georgia, serif;
`;

const InputContainer = styled.input`
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: 5px;
    padding-inline: 10px;

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
    const { ask, answer, loading } = useQuestionAnswer();
    const [message, setMessage] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const MemoizedSpinner = React.memo(JournalContentSpinner);
    const userData = useUserStore((state) => state.getUser());

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(question === ''){
            setMessage('Cannot submit an empty message. Please ask a question.');
            setShowBanner(true);
        }

        setTimeout(() => setShowBanner(false), 5000);
        if(question && userData && userData?.id)
            ask(question, userData);
        
    }, [question, ask, userData]);

    return (
        <QaContainer>
            <EditorBanner message={message || ''} show={showBanner} />
            <Form onSubmit={handleSubmit}>
                <InputContainer type='text' onChange={(e) => setQuestion(e.target.value)} value={question} disabled={loading} placeholder='Ask a question related to a journal...' />
                <Button type='submit' disabled={loading} >Ask</Button>
            </Form>
            <AnswerContainer>
                {(loading || answer) && (
                    <>
                        {loading ? (
                            <TextSpinnerContainer>
                                <MemoizedSpinner />
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