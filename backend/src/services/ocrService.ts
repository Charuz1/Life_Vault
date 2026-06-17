import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const result = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    return '';
  }
};
