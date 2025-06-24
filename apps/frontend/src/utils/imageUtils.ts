export const getFullImagePath = (fileName: string) => {
  if (fileName.includes('http')) {
    return fileName;
  }

  const baseUrl = process.env.NEXT_APP_API_URL;
  return `${baseUrl}/uploads/${fileName}`;
};
