/**
 * Server-side validation utilities for GT Notes data entry
 * Based on standardized formatting rules
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  formatted?: string;
}

/**
 * Validates and formats semester input
 * Format: "Fall 2025"
 * Allowed terms: Spring, Summer, Fall
 * Capitalization: First letter capitalized, rest lowercase
 * Year: 4 digits between 2000 and 2100
 */
export function validateSemester(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return { isValid: false, message: 'Semester is required' };
  }

  const trimmed = input.trim();
  
  // checks format: "Term YYYY"
  const semesterRegex = /^(spring|summer|fall)\s+(\d{4})$/i;
  const match = trimmed.match(semesterRegex);
  
  if (!match) {
    return { 
      isValid: false, 
      message: 'Format should be "Term YYYY" (e.g., "Fall 2025")' 
    };
  }
  
  const [, term, yearStr] = match;
  const year = parseInt(yearStr, 10);
  
  // validates year range
  if (year < 2000 || year > 2100) {
    return { 
      isValid: false, 
      message: 'Year must be between 2000 and 2100' 
    };
  }
  
  // formats correctly: capitalize first letter, lowercase rest
  const formattedTerm = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
  const formatted = `${formattedTerm} ${year}`;
  
  return { 
    isValid: true, 
    formatted 
  };
}

/**
 * Validates and formats course input
 * Format: "CS 1301"
 * Subject: All uppercase letters (2–4 characters)
 * Number: 3–4 digits
 * Spacing: Exactly one space between subject and number
 */
export function validateCourse(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return { isValid: false, message: 'Course is required' };
  }

  const trimmed = input.trim();
  
  // removes extra spaces and normalizes
  const normalized = trimmed.replace(/\s+/g, ' ');
  
  // checks format: "SUBJECT NUMBER"
  const courseRegex = /^([a-zA-Z]{2,4})\s+(\d{3,4})$/;
  const match = normalized.match(courseRegex);
  
  if (!match) {
    return { 
      isValid: false, 
      message: 'Format should be "SUBJECT NUMBER" (e.g., "CS 1301")' 
    };
  }
  
  const [, subject, number] = match;
  

  // formats correctly: uppercase subject
  const formatted = `${subject.toUpperCase()} ${number}`;
  
  return { 
    isValid: true, 
    formatted 
  };
}

/**
 * Validates and formats professor name input
 * Format: "First Last" or "First M. Last"
 * Capitalization: Title case for each name part
 * Allowed characters: Letters, apostrophes ('), and hyphens (-)
 * No titles: Do not include Dr., Prof., Professor, Mr, Mrs, Ms, etc.
 */
export function validateProfessorName(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return { isValid: false, message: 'Professor name is required' };
  }

  const trimmed = input.trim();
  
  // checks for titles that should not be included
  const titleRegex = /^(dr\.?|prof\.?|professor|mr\.?|mrs\.?|ms\.?)\s+/i;
  if (titleRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Do not include titles (Dr., Prof., Mr., Mrs., Ms.)' 
    };
  }
  
  // allows letters, spaces, apostrophes, hyphens, and periods (for middle initials)
  const allowedCharsRegex = /^[a-zA-Z\s'\-.]+$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Only letters, apostrophes, hyphens, and periods are allowed' 
    };
  }
  
  // checks for reasonable name format (at least first and last name)
  //  allows: First Last, First Middle Last, First M. Last, etc.
  const nameRegex = /^[a-zA-Z][a-zA-Z'\-]*(\s+[a-zA-Z]([a-zA-Z'\-]*|\.))*\s+[a-zA-Z][a-zA-Z'\-]*$/;
  if (!nameRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Enter first and last name (e.g., "Jane Smith" or "John Q. Smith")' 
    };
  }
  
  // formats to title case
  const formatted = trimmed
    .split(/(\s+)/)
    .map(word => {
      if (word.trim() === '') return word; // preserve spaces
      
      // handles middle initials (single letter followed by period)
      if (/^[a-zA-Z]\.?$/.test(word)) {
        return word.toUpperCase().endsWith('.') ? word.toUpperCase() : word.toUpperCase() + '.';
      }
      
      // title case for regular words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
  
  return { 
    isValid: true, 
    formatted 
  };
}

/**
 * Validates all note fields and returns validation results
 */
export function validateNoteData(data: {
  title: string;
  course: string;
  professor: string;
  semester: string;
  description?: string;
}): { isValid: boolean; errors: string[]; formattedData?: typeof data } {
  const errors: string[] = [];
  
  // valdates title (basic check)
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  // validates course
  const courseValidation = validateCourse(data.course);
  if (!courseValidation.isValid) {
    errors.push(`Course: ${courseValidation.message}`);
  }
  
  // validates professor
  const professorValidation = validateProfessorName(data.professor);
  if (!professorValidation.isValid) {
    errors.push(`Professor: ${professorValidation.message}`);
  }
  
  // validates semester
  const semesterValidation = validateSemester(data.semester);
  if (!semesterValidation.isValid) {
    errors.push(`Semester: ${semesterValidation.message}`);
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // returns formatted data
  const formattedData = {
    title: data.title.trim(),
    course: courseValidation.formatted || data.course,
    professor: professorValidation.formatted || data.professor,
    semester: semesterValidation.formatted || data.semester,
    description: data.description?.trim() || '',
  };
  
  return { isValid: true, errors: [], formattedData };
}
