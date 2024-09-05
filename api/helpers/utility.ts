export const formatDateOnly = (date1: string | Date) => {
    const date = new Date(date1);

    // Format the date part in the desired format
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
};