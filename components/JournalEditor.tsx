// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import styled from 'styled-components';
// import { useAutosave } from 'react-autosave';
// import Spinner from './Spinner';

// const Container = styled.div`
//   width: 100%;
//   height: 100%;
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 0;
//   position: relative;
// `;

// const SpinnerContainer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   padding: 2px;
// `;

// const EditorContainer = styled.div`
//   grid-column: span 2;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   height: 100%;
//   font-size: 1.5rem;
//   padding: 1rem;
// `;

// const AnalysisContainer = styled.div`
//   border-left: 1px solid #ccc;
// `;

// const AnalysisHeader = styled.h2`
//   font-size: 1.5rem;
//   background-color: #fff;
//   color: #000;
//   padding: 1rem;
// `;

// const AnalysisList = styled.ul`
//   list-style: none;
//   padding: 0;
//   margin: 0;
// `;

// const AnalysisListItem = styled.li`
//   padding: 1rem;
//   border-bottom: 1px solid #ccc;
// `;

// const DeleteButton = styled.button`
//   background-color: #f00;
//   color: #fff;
//   border: none;
//   padding: 0.5rem 1rem;
//   font-size: 1rem;
//   cursor: pointer;
// `;

// const JournalEditor = ({ journal }: any) => {
//     const [text, setText] = useState(journal.content);
//     const [currentJournal, setJournal] = useState(journal);
//     const [isSaving, setIsSaving] = useState(false);
//     const router = useRouter();

//     const handleDelete = async () => {
//         await deleteJournal(journal.id);
//         router.push('/journal');
//     };

//     useAutosave({
//         data: text,
//         onSave: async (_text) => {
//             if (_text === journal.content)
//                 return;

//             setIsSaving(true);

//             const { data } = await updateJournal(journal.id, { content: _text });
//             setJournal(data);
//             setIsSaving(false);
//         }
//     })

//     return (
//         <Container>
//             <SpinnerContainer>
//                 {isSaving ? (
//                     <div role="status">
//                         <span>Saving...</span>
//                     </div>
//                 ) : (
//                     <div><Spinner /></div>
//                 )}
//             </SpinnerContainer>
//             <EditorContainer>
//                 <TextArea value={text} onChange={(e) => setText(e.target.value)} />
//             </EditorContainer>
//             <AnalysisContainer>
//                 <AnalysisHeader>Analysis</AnalysisHeader>
//                 <AnalysisList>
//                     <AnalysisListItem>
//                         <div>Subject</div>
//                         <div>{currentJournal.analysis.subject}</div>
//                     </AnalysisListItem>
//                     <AnalysisListItem>
//                         <div>Mood</div>
//                         <div>{currentJournal.analysis.mood}</div>
//                     </AnalysisListItem>
//                     <AnalysisListItem>
//                         <div>Negative</div>
//                         <div>
//                             {currentJournal.analysis.negative ? 'True' : 'False'}
//                         </div>
//                     </AnalysisListItem>
//                     <AnalysisListItem>
//                         <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
//                     </AnalysisListItem>
//                 </AnalysisList>
//             </AnalysisContainer>
//         </Container>
//     );
// };

// export default JournalEditor; 