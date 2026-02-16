import { useEffect, useRef } from 'react';
import { RoutineTitleForm } from '../../types/exercise';

interface RoutineTitleViewProps {
  form: RoutineTitleForm;
  titlePlaceholder: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function RoutineTitleView({
  form,
  titlePlaceholder,
  onTitleChange,
  onSave,
  onCancel
}: RoutineTitleViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 다이얼로그가 열릴 때 입력 필드에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && form.isValid) {
      onSave();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-title-modal-title"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 
          id="routine-title-modal-title"
          className="text-2xl font-bold mb-4 text-white"
        >
          루틴 제목 입력
        </h2>

        <div className="mb-6">
          <input
            ref={inputRef}
            id="routine-title-input"
            type="text"
            aria-label="루틴 제목"
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              form.error ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder={titlePlaceholder}
            aria-describedby={form.error ? 'title-error' : undefined}
          />
          {form.error && (
            <p 
              id="title-error"
              className="text-red-400 text-sm mt-2"
              role="alert"
            >
              {form.error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            취소
          </button>
          <button
            onClick={onSave}
            disabled={!form.isValid}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
} 
