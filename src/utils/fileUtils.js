/**
 * Utility functions for handling file uploads and parsing
 */

/**
 * Validates if the file is a PDF or DOCX
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const validateFileType = (file) => {
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return validTypes.includes(file.type);
};

/**
 * Extracts text content from a PDF file
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - The extracted text
 */
import { pdfjs } from 'react-pdf';

// Configure pdfjs worker - react-pdf includes a recommended CDN path but
// we can use the bundled worker from pdfjs-dist when available.
try {
  // Try to set the workerSrc to the CDN entry. This is safe in most setups.
  // If your build serves assets differently you can adjust this path.
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
} catch (e) {
  // ignore if pdfjs isn't available at import time in the environment
}

export const extractTextFromPDF = async (file) => {
  // Only handle PDFs here. For other types the caller should handle accordingly.
  if (!file || file.type !== 'application/pdf') {
    // Fallback: return empty string so extraction functions still run
    return '';
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      // load page and extract text content
      // eslint-disable-next-line no-await-in-loop
      const page = await pdf.getPage(i);
      // eslint-disable-next-line no-await-in-loop
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(' ') + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // As a last resort, return empty string so downstream doesn't crash
    return '';
  }
};

/**
 * Extracts candidate information from resume text
 * @param {string} text - The extracted text from the resume
 * @returns {Object} - The extracted candidate information
 */
export const extractCandidateInfo = (text) => {
  // Extract email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  const email = emails.length > 0 ? emails[0] : '';
  
  // Extract phone numbers - supports various formats
  const phoneRegexes = [
    // Format: (123) 456-7890
    /\(\d{3}\)\s*\d{3}[-.]?\d{4}/g,
    // Format: 123-456-7890
    /\d{3}[-.]\d{3}[-.]\d{4}/g,
    // Format: 123.456.7890
    /\d{3}[.]\d{3}[.]\d{4}/g,
    // Format: 123 456 7890
    /\d{3}\s\d{3}\s\d{4}/g,
    // Format: +1 123 456 7890
    /[+]\d{1,3}\s\d{3}\s\d{3}\s\d{4}/g,
    // Format: 1234567890
    /\d{10}/g
  ];
  
  let phone = '';
  for (const regex of phoneRegexes) {
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      phone = matches[0];
      break;
    }
  }
  
  // Extract name - look for common name patterns
  // Try to find name in common resume header formats
  let name = '';

  try {
    // Break the text into lines and inspect the top 6 lines for a name-like line
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 10);

    // Helper to check if a line looks like a name
    const looksLikeName = (line) => {
      // ignore lines that contain email or phone or words like 'experience', 'skills'
      if (/\b(email|experience|skills|summary|professional|objective)\b/i.test(line)) return false;
      if (/[@\d]/.test(line)) return false;
      // If it's all caps and 2-4 words, likely a name header
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        const allCaps = words.every(w => /^[A-Z][A-Z.'-]*$/.test(w));
        const titleCase = words.every(w => /^[A-Z][a-z'`.-]+$/.test(w));
        if (allCaps || titleCase) return true;
      }
      return false;
    };

    for (const line of lines) {
      if (looksLikeName(line)) {
        name = line.replace(/\s{2,}/g, ' ').trim();
        break;
      }
    }

    // Fallback: try regex matches anywhere in document
    if (!name) {
      const nameRegexes = [
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
        /([A-Z]+(?:\s+[A-Z]+){1,3})/g
      ];
      for (const regex of nameRegexes) {
        const m = regex.exec(text);
        if (m && m[1]) {
          const candidate = m[1].trim();
          // discard matches that look like sections or company names
          if (!/\b(EXPERIENCE|EDUCATION|SUMMARY|OBJECTIVE|SKILLS)\b/i.test(candidate)) {
            name = candidate;
            break;
          }
        }
      }
    }

    // Last resort: use email local-part (before @) and convert dots/underscores to spaces
    if (!name && email) {
      const local = email.split('@')[0];
      const parts = local.split(/[._]/).map(p => p.charAt(0).toUpperCase() + p.slice(1));
      if (parts.length > 0) name = parts.join(' ');
    }
  } catch (e) {
    // ignore and return empty name if anything goes wrong
    name = '';
  }
  
  return {
    name,
    email,
    phone,
  };
};