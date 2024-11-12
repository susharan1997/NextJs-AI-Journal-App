"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface journalEditorPropType {
  journal: EntryAnalysisType | null;
}

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

  &: disabled {
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
  padding-inline: 35px;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

  &: hover {
    background-color: #e9ecef;
    cursor: pointer;
  }
`;

const JournalEditor: React.FC<journalEditorPropType> = ({ journal }) => {
  const [text, setText] = useState("New content");
  const [currentJournal, setJournal] = useState<EntryAnalysisType | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<emotionTypes>({
    subject: "",
    mood: "",
    negative: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const moodColor = useFormattedColors(currentJournal?.color!);
  const userData = useUserStore((state) => state.getUser());
  const downloadItemsList = ["PDF", "Word"];

  useEffect(() => {
    if (journal) {
      const journalContent = journal?.entryId?.content ?? "";
      setText(journalContent);
      setJournal(journal);
      setAnalysis({
        subject: journal?.subject ?? "No Subject",
        mood: journal?.mood ?? "No Mood",
        negative: journal?.negative ?? false,
      });
      setIsLoading(false);
    }
  }, [journal]);

  const handleDelete = async () => {
    try {
      if (journal?.entryId && userData && userData?.id) {
        const { data } = await deleteJournal(journal?.entryId?._id, userData);
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

  const handleJournalUpdate = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = e.target.value as string;
    setText(newText);
    setJournal(journal);

    if (newText === journal?.entryId?.content) return;

    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
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
        res = await updateJournal(journalId, { content: text }, userData);

      if (res && res.data) {
        setJournal(res.data);
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

    doc.setFontSize(16);
    doc.text("Journal Entry", margin, 20);

    doc.setFontSize(12);
    doc.text(`Subject: ${analysis.subject}`, margin, 30);
    doc.text(`Mood: ${analysis.mood}`, margin, 40);

    const content = `Content: ${text}`;
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
            new Paragraph(`Content: ${text}`),
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
      <SpinnerContainer>
        {isSaving ? (
          <div role="status">
            <span>Saving...</span>
          </div>
        ) : (
          <div>
            <Spinner />
          </div>
        )}
      </SpinnerContainer>
      <EditorContainer>
        {isLoading ? (
          <TextSpinnerContainer>
            <JournalContentSpinner />
          </TextSpinnerContainer>
        ) : (
          <TextArea value={text} onChange={handleJournalUpdate} />
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
              <SaveButton onClick={handleSave} disabled={isLoading || isSaving}>
                Update
              </SaveButton>
              <DeleteButton onClick={handleDeleteClick} disabled={isLoading || isSaving}>
                Delete
              </DeleteButton>
              <DownloadComponentContainer>
                <DownloadButton
                  onClick={() => setOpen((prev) => !prev)}
                  disabled={isLoading || isSaving}
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