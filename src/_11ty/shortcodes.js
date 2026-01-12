export const year = () => {
    return `${new Date().getFullYear()}`;
};

export const convertTime = (UTCDate) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    return `${new Date(UTCDate).toLocaleDateString(undefined, options)}`;
};
