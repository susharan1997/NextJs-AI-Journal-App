import React, { useState } from 'react';
import styled from 'styled-components';
import { useDateFormat } from '@/utils/useDateFormat';

interface QaType {
    question: string,
    answer: string,
    createdAt: string,
}

interface QaDataType {
    data: QaType[]
}

const QaDropdownContainer = styled.div`
  width: 90%;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Question = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isOpen',
}) <{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.isOpen ? '#f0f0f0' : '#e0e0e0')};
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #808080;

  &:hover {
    background-color: #d0d0d0;
  }
  `;

const Answer = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-top: 1px solid #ccc;
  text-align: justify;
  text-justify: inter-word;
`;

const ArrowIcon = styled.svg.withConfig({
    shouldForwardProp: (prop) => prop !== 'isOpen',
}) <{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  margin-left: 20px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const DateSpan = styled.span`
    font-size: 0.63em;
`;

const DateText = styled.span`
    font-weight: bold;
`;

const QuestionText = styled.span`
    font-weight: bold;
`;

const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const QaDropdownComponent: React.FC<QaDataType> = ({ data }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(index === openIndex ? null : index);
    }

    return (
        <QaDropdownContainer>
            {
                data.map((qa, index) => (
                    <div key={index}>
                        <Question isOpen={openIndex === index} onClick={() => handleToggle(index)}>
                            <QuestionContent>
                                <DateSpan>
                                    (created on -
                                    <DateText>
                                        {useDateFormat(qa.createdAt)})
                                    </DateText>
                                </DateSpan>
                                <QuestionText>
                                    {qa.question}
                                </QuestionText>
                            </QuestionContent>
                            <ArrowIcon
                                isOpen={openIndex === index}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </ArrowIcon>
                        </Question>
                        {
                            (openIndex === index) &&
                            <Answer>
                                {qa.answer}
                            </Answer>
                        }
                    </div>
                ))
            }
        </QaDropdownContainer>
    )
}

export default QaDropdownComponent;