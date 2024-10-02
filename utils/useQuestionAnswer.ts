import { useCallback, useState } from "react";
import { askQuestion } from '@/utils/api';
import { userDataType } from "@/types";

export const useQuestionAnswer = () => {
    const [state, setState] = useState<{ answer: string, loading: boolean }>();

    const ask = useCallback(async (question: string, userData: userDataType) => {
        setState({ answer: '', loading: true });

        if (!userData)
            console.log('Invalid user ID');

        try {
            const { data } = await askQuestion(question, userData);
            setState({ answer: data || 'No answer found!', loading: false });
        }
        catch (error) {
            console.error('Error fetching answer:', error);
            setState({ answer: 'Error occurred. Please try again!', loading: false });
        }
    }, []);

    return { ask, answer: state?.answer, loading: state?.loading };
}