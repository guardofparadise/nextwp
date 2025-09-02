interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export default function ErrorMessage({ message = 'Something went wrong', retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-900">Error</h3>
        </div>
        <p className="text-red-700 mb-4">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}