'use client';
import { askQuestion } from '@/utils/api';
import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
    margin-top: 30px;
    height: 50px;
    display: flex;
    align-items: center;
`;

const InputContainer = styled.input`
    position: relative;
    width: 90%;
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
    width: 100%;
`;

const AnswerContainer = styled.div`
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-y: auto;
`;

const Question = () => {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const { data } = await askQuestion(question);
        if (data) {
            setAnswer(data);
            setLoading(false);
            setQuestion('');
        }
        else {
            console.error('Something went wrong!', data);
        }
    }

    return (
        <QaContainer>
            <Form onSubmit={handleSubmit}>
                <InputContainer type='text' onChange={(e) => setQuestion(e.target.value)} value={question} disabled={loading} placeholder='Ask a question...' />
                <Button type='submit' disabled={loading} >Ask</Button>
            </Form>
            {true &&
                (<AnswerContainer>
                    <p>
                        {answer}
                    </p>
                </AnswerContainer>)
            }
        </QaContainer>
    )
}

export default Question;