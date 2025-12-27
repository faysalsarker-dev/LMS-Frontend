/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IQuestion } from "@/interface/lesson.type";

export const convertToBackendFormat = (question: IQuestion) => {
  // For MCQ and True/False, find the correct answer from options
  if (question.type === 'mcq' || question.type === 'true_false') {
    const correctOption = question.options.find(opt => opt.isCorrect);
    return {
      type: question.type,
      questionText: question.questionText,
      audio: question.audioUrl || null,
      options: question.options.map(opt => ({ text: opt.text })),
      correctAnswer: correctOption ? correctOption.text : '',
      explanation: question.explanation || null,
      timer: question.timer || null,
    };
  }
  
  // For other question types (fill_blank, short_answer, audio)
  return {
    type: question.type,
    questionText: question.questionText,
    audio: question.audioUrl || null,
    options: [],
    correctAnswer: question.correctAnswer || question.modelAnswer || '',
    explanation: question.explanation || null,
    timer: question.timer || null,
  };
};

// Helper function to convert backend format to frontend format
export const convertFromBackendFormat = (backendQuestion: any): IQuestion => {
  const base = {
    type: backendQuestion.type,
    questionText: backendQuestion.questionText,
    explanation: backendQuestion.explanation || '',
    timer: backendQuestion.timer,
    audioUrl: backendQuestion.audio || '',
    audioFile: null,
    modelAnswer: '',
  };

  if (backendQuestion.type === 'mcq' || backendQuestion.type === 'true_false') {
    return {
      ...base,
      options: backendQuestion.options.map((opt: any) => ({
        text: opt.text,
        isCorrect: opt.text === backendQuestion.correctAnswer,
      })),
      correctAnswer: backendQuestion.correctAnswer,
    };
  }

  return {
    ...base,
    options: [],
    correctAnswer: backendQuestion.correctAnswer || '',
  };
};