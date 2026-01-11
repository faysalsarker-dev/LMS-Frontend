/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import jsPDF from 'jspdf';

type Question = {
  type: 'mcq' | 'true_false' | 'fill_blank' | 'short_answer' | 'audio';
  questionText: string | Record<string, unknown>;
  audio?: string | null;
  options?: { text: string }[];
  correctAnswer?: unknown;
  explanation?: string | null;
  timer?: number | null;
};

const COLORS = {
  primary: [44, 199, 182] as [number, number, number],
  secondary: [255, 159, 0] as [number, number, number],
  accent: [139, 92, 246] as [number, number, number],
  background: [255, 255, 255] as [number, number, number],
  foreground: [23, 23, 23] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
};

// PDF Generation Function
async function generateQuestionPDF(
  question: Question,
  config?: {
    showAnswer?: boolean;
    showExplanation?: boolean;
  }
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const showAnswer = config?.showAnswer ?? false;
  const showExplanation = config?.showExplanation ?? false;

  try {
    /* ---------------- LOAD LOGOS ---------------- */
    const iconLogo = await loadImageAsBase64('/humanistic.png');
    const fullLogo = await loadImageAsBase64('/humanistic_language_center.png');

    /* ---------------- BACKGROUND ---------------- */
    doc.setFillColor(...COLORS.background);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    /* ---------------- WATERMARK (LARGER & CENTERED) ---------------- */
    if (fullLogo) {
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
      const watermarkSize = 140; // Increased from 100
      doc.addImage(
        fullLogo,
        'PNG',
        pageWidth / 2 - watermarkSize / 2,
        pageHeight / 2 - watermarkSize / 2,
        watermarkSize,
        watermarkSize
      );
      doc.restoreGraphicsState();
    }

    /* ---------------- HEADER ---------------- */
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 4, 'F');

    if (iconLogo) {
      doc.addImage(iconLogo, 'PNG', 14, 10, 20, 20);
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.foreground);
    doc.text('Humanistic Language Center', 38, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Question Assessment', 38, 26);

    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(14, 36, pageWidth - 14, 36);

    /* ---------------- CONTENT ---------------- */
    let y = 48;

    // Question Type Badge
    doc.setFillColor(...COLORS.primary);
    const typeText = formatQuestionType(question.type);
    const typeWidth = doc.getTextWidth(typeText) + 8;
    doc.roundedRect(14, y - 5, typeWidth, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(typeText, 18, y);
    y += 14;

    // Timer badge
    if (question.timer) {
      doc.setFillColor(...COLORS.accent);
      const timerText = `⏱ ${question.timer}s`;
      const timerWidth = doc.getTextWidth(timerText) + 8;
      doc.roundedRect(14, y - 5, timerWidth, 8, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(timerText, 18, y);
      y += 14;
    }

    // Question Text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.foreground);
    doc.text('Question:', 14, y);
    y += 7;

    const questionText =
      typeof question.questionText === 'string'
        ? question.questionText
        : JSON.stringify(question.questionText, null, 2);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.foreground);
    const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 32);
    doc.text(splitQuestion, 18, y);
    y += splitQuestion.length * 6 + 8;

    /* ---------------- OPTIONS ---------------- */
    if (question.options && question.options.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.foreground);
      doc.text('Options:', 14, y);
      y += 7;

      question.options.forEach((opt, i) => {
        const optionLetter = String.fromCharCode(65 + i);
        
        doc.setFillColor(...COLORS.primary);
        doc.circle(20, y - 2, 3, 'F');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(optionLetter, 19.2, y + 0.5);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.foreground);
        const splitOption = doc.splitTextToSize(opt.text, pageWidth - 40);
        doc.text(splitOption, 26, y);
        y += Math.max(splitOption.length * 5.5, 8);
      });
      y += 4;
    }

    /* ---------------- AUDIO INFO ---------------- */
    if (question.audio) {
      y += 4;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(14, y - 5, pageWidth - 28, 10, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...COLORS.gray);
      doc.text('🎵 Audio question - playback available in app', 18, y);
      y += 12;
    }

    /* ---------------- ANSWER SECTION ---------------- */
    if (showAnswer && question.correctAnswer !== undefined) {
      y += 6;
      
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, y - 5, pageWidth - 28, 12, 2, 2, 'FD');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text('✓ Correct Answer:', 18, y);
      
      doc.setFont('helvetica', 'normal');
      const answerText = String(question.correctAnswer);
      doc.text(answerText, 18, y + 5);
      y += 18;
    }

    /* ---------------- EXPLANATION ---------------- */
    if (showExplanation && question.explanation) {
      y += 4;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.foreground);
      doc.text('Explanation:', 14, y);
      y += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      const splitExplanation = doc.splitTextToSize(question.explanation, pageWidth - 32);
      doc.text(splitExplanation, 18, y);
    }

    /* ---------------- FOOTER ---------------- */
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(
      '© 2026 Humanistic Language Center - All Rights Reserved',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );

    doc.setFontSize(7);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    doc.setFillColor(...COLORS.primary);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

    /* ---------------- SAVE PDF ---------------- */
    const fileName = `question_${question.type}_${Date.now()}.pdf`;
    doc.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/* ---------------- IMAGE LOADER ---------------- */
function loadImageAsBase64(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('Error converting image to base64:', error);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      console.warn(`Could not load image: ${url}`);
      resolve(null);
    };
    
    img.src = url;
  });
}

function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    mcq: 'Multiple Choice',
    true_false: 'True/False',
    fill_blank: 'Fill in the Blank',
    short_answer: 'Short Answer',
    audio: 'Audio Question',
  };
  return typeMap[type] || type.toUpperCase();
}

/* ============================================ */
/* DOWNLOAD BUTTON COMPONENT */
/* ============================================ */

interface DownloadQuestionPDFButtonProps {
  question: Question;
  showAnswer?: boolean;
  showExplanation?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function DownloadQuestionPDFButton({
  question,
  showAnswer = false,
  showExplanation = false,
  className = '',
  children,
}: DownloadQuestionPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    setIsLoading(true);
    setStatus('idle');

    try {
      await generateQuestionPDF(question, {
        showAnswer,
        showExplanation,
      });
      
      setStatus('success');
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      setStatus('error');
      
      // Reset error state after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = 'px-4 py-2 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]';
  
  const statusClasses = {
    idle: 'bg-primary hover:bg-primary/90 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  const buttonClass = `${baseClasses} ${statusClasses[status]} ${className} ${
    isLoading ? 'opacity-80 cursor-wait' : ''
  }`;

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={buttonClass}
      aria-label="Download question as PDF"
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {status === 'success' && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      
      {status === 'error' && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      
      {!isLoading && status === 'idle' && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}
      
      <span>
        {isLoading
          ? 'Generating...'
          : status === 'success'
          ? 'Downloaded!'
          : status === 'error'
          ? 'Failed'
          : children || 'Download PDF'}
      </span>
    </button>
  );
}

