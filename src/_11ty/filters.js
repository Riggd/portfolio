export const convertTime = (UTCDate) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    return `${new Date(UTCDate).toLocaleDateString(undefined, options)}`;
};