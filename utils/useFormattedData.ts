import { QaType } from '@/types';

const formattedDate = (date: Date) => {
    const dateString = new Date(date);

    if(isNaN(dateString.getTime())){
        return '-';
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };

    const formattedDate = dateString.toLocaleDateString('en-US', options);
    return ' ' + formattedDate || '-';
}

export const formattedData = (data: QaType[]): QaType[] => {
    const updatedData = data.map((qa: QaType) => ({
        ...qa,
        formattedDate: formattedDate(qa.createdAt),
    }));

    return updatedData;
}