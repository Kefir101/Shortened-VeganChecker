import './shim.js'
// import translate from 'translate-google-api';
import { config } from './config.js'
import { translate } from '@vitalets/google-translate-api';

const API_URL = config.API_URL;

function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}
async function callGoogleVisionAsync(image) {
  const body = generateBody(image);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  const detectedText = result.responses[0].fullTextAnnotation;
  const wordAndBox = {};

  detectedText.pages.forEach(page => {
    page.blocks.forEach(block => {
      block.paragraphs.forEach(paragraph => {
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join('');
          wordAndBox[wordText.toLowerCase()] = word.boundingBox.vertices;
        });
      });
    });
  });
  return detectedText ? [detectedText, wordAndBox] : [{ text: "No text found." }, wordAndBox];
}
async function parseTextBothWays(text) {
  let translated = await translate(text, { to: 'en' });
}
export const OCR = callGoogleVisionAsync;
export const parse = parseTextBothWays;
