import { Interview, Job, CV } from '../types';

// Function to format date for iCalendar
const formatIcsDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export const generateIcsFile = (interview: Interview, job: Job, candidate: CV) => {
    const startDate = new Date(interview.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

    const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//JobPortal//EN',
        'BEGIN:VEVENT',
        `UID:${interview.id}@jobportal.com`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(startDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:Interview: ${candidate.name} for ${job.title}`,
        `DESCRIPTION:Interview with ${candidate.name} for the ${job.title} position at ${job.company}.\\n\\nNotes: ${interview.notes || 'No notes provided.'}`,
        `LOCATION:${interview.locationOrLink}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `interview-${candidate.name.replace(/\s/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};