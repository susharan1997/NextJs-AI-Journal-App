"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Spinner from "./Spinner";
import { deleteJournal, updateJournal } from "@/utils/api";
import JournalContentSpinner from "./JournalContentSpinner";
import EditorBanner from "./EditorBanner";
import { EntryAnalysisType } from "@/types";
import { useFormattedColors } from "@/utils/useFormattedColors";
import useUserStore from "@/store/useStore";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import saveAs from "file-saver";

interface emotionTypes {
  subject: string;
  mood: string;
  negative: boolean;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  position: relative;
  font-family: "Merriweather", Georgia, serif;
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
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>`
  font-size: 1.5rem;
  font-weight: bold;
  background-color: ${(props) => props.color};
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

  &: disabled {
    background-color: grey;
    cursor: none;
  }
`;

const SaveButton = styled.button`
  background-color: #30c71c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &: hover {
    background-color: #1c960c;
  }

  &: disabled {
    background-color: grey;
    cursor: none;
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
  z-index: 1000;
`;

const DialogBox = styled.div`
  width: 250px;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
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

const CancelText = styled.span`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const UpdateDeleteButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
`;

const DownloadComponentContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 5px;
`;

const DownloadButton = styled.button`
  position: relative;
  width: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: #24ace3;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #006994;
  }

  &:disabled {
    background-color: grey;
    cursor: none;
  }
`;

const ButtonText = styled.span`
  color: white;
`;

const DownloadItemsContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  position: absolute;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  width: 120px;
  top: 100%;
  right: 0;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  z-index: 1;
`;

const DownloadItem = styled.div`
  width: 100%;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

  &: hover {
    background-color: #e9ecef;
    cursor: pointer;
  }
`;

const RecordButton = styled.button`
  position: absolute;
  top: 10px;
  left: 40em;
  width: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background-color: #e9ecef;
  color: black;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid red;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c8cacc;
  }

  &:disabled {
    background-color: grey;
  }
`;

const StyledRecordSvg = styled.svg.withConfig({
  shouldForwardProp: (prop) => prop !== "isRecording",
})<{ isRecording: boolean }>`
  width: 24px;
  height: 24px;

  .recording-dot {
    animation: ${({ isRecording }) =>
      isRecording ? "blink 1.5s infinite" : "none"};
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const JournalEditor: React.FC = () => {
  const [currentJournal, setJournal] = useState<EntryAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<emotionTypes>({
    subject: "",
    mood: "",
    negative: false,
  });
  const userData = useUserStore((state) => state.getUser());
  const journalId = useUserStore((state) => state.getJournalId());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const moodColor = useFormattedColors(currentJournal?.color!);
  const recognitionRef = useRef<any | null>(null);
  const [cursorPos, setCursorPos] = useState<number>(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const downloadItemsList = ["PDF", "Word"];

  const fetchJournal = async () => {
    if (userData && journalId) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/journal-entry/${journalId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData.id),
        });

        const { entryAnalysis } = await response.json();
        setJournal(entryAnalysis);
        setAnalysis((prev) => ({
          subject: entryAnalysis?.subject || "",
          mood: entryAnalysis?.mood || "",
          negative: entryAnalysis?.negative || false,
        }));
      } catch (error) {
        console.error("Error fetching journal:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setJournal(null);
    setAnalysis({
      subject: "",
      mood: "",
      negative: false,
    });
    fetchJournal();
  }, [journalId, userData]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  });

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.selectionStart = cursorPos;
      textAreaRef.current.selectionEnd = cursorPos;
    }
  }, [cursorPos, currentJournal?.entryId?.content]);

  const handleStartRecord = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.log("Speech recognition not supported in this browser!.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            transcript += result[0].transcript;
          }
        }

        if (transcript && textAreaRef.current) {
          const textArea = textAreaRef.current;
          const start = textAreaRef.current!.selectionStart;
          const end = textAreaRef.current!.selectionEnd;

          setJournal((prev) => {
            if (prev) {
              const updatedContent =
                prev.entryId.content.slice(0, start) +
                transcript +
                prev.entryId.content.slice(end);

              const newCursorPos = start + transcript.length;
              setCursorPos(newCursorPos);
              return {
                ...prev,
                entryId: {
                  ...prev.entryId,
                  content: updatedContent,
                },
              };
            }
            return prev;
          });
          setTimeout(() => {
            textArea.focus();
            textArea.setSelectionRange(
              start + transcript.length,
              start + transcript.length
            );
          }, 0);
        }
      };

      recognition.onerror = (error: any) => {
        console.error("Speech recognition error: ", error.message);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }

    recognitionRef.current?.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecord = () => {
    if (isRecording) handleStopRecording();
    else handleStartRecord();
  };

  const handleCursorChange = () => {
    if (textAreaRef.current) setCursorPos(textAreaRef.current.selectionStart);
  };

  const handleDelete = async () => {
    try {
      if (currentJournal?.entryId && userData && userData?.id) {
        const { data } = await deleteJournal(
          currentJournal?.entryId?._id,
          userData
        );
        if (data) {
          const url = new URL("/journal", window.location.origin);
          url.searchParams.append("deleted", data.id);
          router.replace(url.toString());
        } else {
          console.log("Journal not deleted!");
        }
      } else {
        console.log("Invalid journal Id!");
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
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

  const handleSave = async () => {
    setIsLoading(true);
    const journalId = currentJournal?.entryId?._id;

    if (!journalId) {
      console.log("Invalid Journal Id!");
      return;
    }

    try {
      let res;
      if (journalId && userData && userData?.id)
        res = await updateJournal(
          journalId,
          { content: currentJournal?.entryId?.content },
          userData
        );

      if (res && res.data) {
        setJournal(res.data);
        setAnalysis((prev) => ({
          subject: res.data.analysis.subject,
          mood: res.data.analysis.mood,
          negative: res.data.analysis.negative,
        }));
        setMessage("Journal updated!");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 2000);
      } else {
        console.error("Failed to update journal or no data returned:", res);
      }
    } catch (error) {
      console.error("Error updating journal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (item: string) => {
    setOpen(false);
    if (item === "PDF") handleDownloadPdf();
    else if (item === "Word") handleDownloadWord();
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setProperties({
      title: `${analysis.subject || "Journal Entry"}`,
      subject: analysis.subject,
      author: userData?.name || "Unknown author",
      keywords: "Journal, entry, analysis",
    });

    doc.setFontSize(16);
    doc.text("Journal Entry", margin, 20);
    doc.setFontSize(12);
    doc.text(`Subject: ${analysis.subject}`, margin, 30);
    doc.text(`Mood: ${analysis.mood}`, margin, 40);

    const content = `Content: ${currentJournal?.entryId.content}`;
    const contentLines = doc.splitTextToSize(
      content,
      doc.internal.pageSize.width - margin * 2
    );

    let y = 50;
    contentLines.forEach((line: any) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin + 10; // Start at a new line on the next page
      }
      doc.text(line, margin, y);
      y += 7; // Line height adjustment
    });

    doc.save(`${analysis.subject || "journal"}.pdf`);
  };

  const handleDownloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Journal Entry",
              heading: "Heading1",
            }),
            new Paragraph(`Subject: ${analysis.subject}`),
            new Paragraph(`Mood: ${analysis.mood}`),
            new Paragraph(`Content: ${currentJournal?.entryId.content}`),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${analysis.subject || "journal"}.docx`);
  };

  return (
    <Container>
      <EditorBanner message={message || ""} show={showBanner} />
      {isDialogOpen && (
        <DialogOverlay>
          <DialogBox>
            <CancelText>Are you sure?</CancelText>
            <UpdateDeleteButtonContainer>
              <DialogButton onClick={handleConfirmDelete}>Yes</DialogButton>
              <CancelButton onClick={handleCancelDelete}>Cancel</CancelButton>
            </UpdateDeleteButtonContainer>
          </DialogBox>
        </DialogOverlay>
      )}
      <RecordButton onClick={handleRecord} disabled={isLoading}>
        {isRecording ? "Stop" : "Speak"}
        {isRecording ? (
          <StyledRecordSvg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            isRecording={true}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
            <circle
              className="recording-dot"
              cx="12"
              cy="12"
              r="5"
              fill="red"
            />
          </StyledRecordSvg>
        ) : (
          <img
            src="/icons/mic-svgrepo-com.svg"
            alt="Microphone"
            width="24"
            height="24"
          />
        )}
      </RecordButton>
      <EditorContainer>
        {isLoading ? (
          <TextSpinnerContainer>
            <JournalContentSpinner />
          </TextSpinnerContainer>
        ) : (
          <TextArea
            value={currentJournal?.entryId?.content || ""}
            ref={textAreaRef}
            onChange={(e) =>
              setJournal((prev) =>
                prev
                  ? {
                      ...prev,
                      entryId: { ...prev.entryId, content: e.target.value },
                    }
                  : null
              )
            }
            onClick={handleCursorChange}
            onKeyUp={handleCursorChange}
            onInput={handleCursorChange}
          />
        )}
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
            <div>{analysis?.negative === false ? "False" : "True"}</div>
          </AnalysisListItem>
          <AnalysisListItem>
            <ButtonContainer>
              <SaveButton onClick={handleSave} disabled={isLoading}>
                Update
              </SaveButton>
              <DeleteButton onClick={handleDeleteClick} disabled={isLoading}>
                Delete
              </DeleteButton>
              <DownloadComponentContainer>
                <DownloadButton
                  onClick={() => setOpen((prev) => !prev)}
                  disabled={isLoading}
                >
                  <ButtonText>Download</ButtonText>
                  <img
                    src="/icons/down-line-svgrepo-com.svg"
                    alt="Down Arrow"
                    width="24"
                    height="24"
                  />
                </DownloadButton>
                <DownloadItemsContainer isOpen={open}>
                  {downloadItemsList.map((item, index) => (
                    <DownloadItem
                      onClick={() => handleDownload(item)}
                      key={index}
                    >
                      {item}
                    </DownloadItem>
                  ))}
                </DownloadItemsContainer>
              </DownloadComponentContainer>
            </ButtonContainer>
          </AnalysisListItem>
        </AnalysisList>
      </AnalysisContainer>
    </Container>
  );
};

export default JournalEditor;
