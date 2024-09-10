'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';
import { deleteJournal, updateJournal } from '@/utils/api';
import JournalContentSpinner from './JournalContentSpinner';
import EditorBanner from './EditorBanner';
import { EntryAnalysisType } from '@/types';
import { useFormattedColors } from '@/utils/useFormattedColors';

interface journalEditorPropType {
    journal: EntryAnalysisType | null
}

interface emotionTypes {
    subject: string,
    mood: string,
    negative: boolean,
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  position: relative;
  font-family: 'Merriweather', Georgia, serif;
`;

const SpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px;
`;

const TextSpinnerContainer = styled.div`
    top: 50%;
    left: 30%;
    position: absolute;
`;

const EditorContainer = styled.div`
  grid-column: span 2;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  padding: 1rem;
`;

const AnalysisContainer = styled.div`
  border-left: 1px solid #ccc;
`;

const AnalysisHeader = styled.h2.withConfig({
    shouldForwardProp: (prop) => prop !== 'color',
}) <{ color: string }>`
  font-size: 1.5rem;
  font-weight: bold;
  background-color: ${props => props.color};
  color: #000;
  padding: 1rem;
`;

const AnalysisList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AnalysisListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #ccc;
`;

const DeleteButton = styled.button`
  background-color: #f54556;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &: hover {
    background-color: #b80214;
  }
`;

const PropertiesText = styled.div`
    font-size: 1.2em;
    font-weight: bold;
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DialogBox = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const DialogButton = styled.button`
  background-color: #f54556;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b80214;
  }
`;

const CancelButton = styled(DialogButton)`
  background-color: #ccc;
  &:hover {
    background-color: #aaa;
  }
`;

const JournalEditor: React.FC<journalEditorPropType> = ({journal}) => {
    const [text, setText] = useState('New content');
    const [currentJournal, setJournal] = useState<EntryAnalysisType | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [analysis, setAnalysis] = useState<emotionTypes>({
        subject: '',
        mood: '',
        negative: false,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const moodColor = useFormattedColors(currentJournal?.color!);

    useEffect(() => {
        if (journal) {
            const journalContent = journal?.entryId?.content ?? '';
            setText(journalContent);
            setJournal(journal);
            setAnalysis({
                subject: journal?.subject ?? 'No Subject',
                mood: journal?.mood ?? 'No Mood',
                negative: journal?.negative ?? false,
            })
            setIsLoading(false);
        }
    }, [journal]);

    const handleDelete = async () => {
        try {
            if(journal?.entryId){
                const { data } = await deleteJournal(journal?.entryId?._id);
            if (data) {
                const url = new URL('/journal', window.location.origin);
                url.searchParams.append('deleted', data.id);
                router.replace(url.toString());
            }
            else {
                console.log('Journal not deleted!');
            }
            }
            else{
                console.log('Invalid journal Id!');
            }
        }
        catch (error) {
            console.error('Error deleting journal:', error);
        }
    };

    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDialogOpen(false);
        await handleDelete();
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    const handleJournalUpdate = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value as string;
        setText(newText);
        setJournal(journal);

        if (newText === journal?.entryId?.content)
            return;

        setIsSaving(true);
        const journalId = currentJournal?.entryId?._id;

        if(!journalId){
            console.log('Invalid Journal Id!');
            return;
        }

        try {
            const res = await updateJournal(journalId, { content: newText });

            if (res && res.data) {

                setJournal(res.data);
                setMessage('Journal updated!');
                setShowBanner(true);
                setTimeout(() => setShowBanner(false), 2000);
            }
            else {
                console.error('Failed to update journal or no data returned:', res);
            }
        }
        catch (error) {
            console.error('Error updating journal:', error);
        }
        finally {
            setIsSaving(false);
        }
    }

    return (
        <Container>
            <EditorBanner message={message || ''} show={showBanner} />
            {isDialogOpen && (
                <DialogOverlay>
                    <DialogBox>
                        <p>Are you sure?</p>
                        <DialogButton onClick={handleConfirmDelete}>Yes</DialogButton>
                        <CancelButton onClick={handleCancelDelete}>Cancel</CancelButton>
                    </DialogBox>
                </DialogOverlay>
            )}
            <SpinnerContainer>
                {isSaving ? (
                    <div role="status">
                        <span>Saving...</span>
                    </div>
                ) : (
                    <div><Spinner /></div>
                )}
            </SpinnerContainer>
            <EditorContainer>
                {
                    isLoading ? (
                        <TextSpinnerContainer>
                            <JournalContentSpinner />
                        </TextSpinnerContainer>

                    ) : (
                        <TextArea value={text} onChange={handleJournalUpdate} />
                    )
                }
            </EditorContainer>
            <AnalysisContainer>
                <AnalysisHeader color={moodColor}>Analysis</AnalysisHeader>
                <AnalysisList>
                    <AnalysisListItem>
                        <PropertiesText>Subject:</PropertiesText>
                        <div>{analysis?.subject}</div>
                    </AnalysisListItem>
                    <AnalysisListItem>
                        <PropertiesText>Mood:</PropertiesText>
                        <div>{analysis?.mood}</div>
                    </AnalysisListItem>
                    <AnalysisListItem>
                        <PropertiesText>Negative:</PropertiesText>
                        <div>
                            {analysis?.negative === false ? 'False' : 'True'}
                        </div>
                    </AnalysisListItem>
                    <AnalysisListItem>
                        <DeleteButton onClick={handleDeleteClick}>Delete</DeleteButton>
                    </AnalysisListItem>
                </AnalysisList>
            </AnalysisContainer>
        </Container>
    );
};

export default JournalEditor; 