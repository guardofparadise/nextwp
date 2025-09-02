interface ErrorMessageProps {
  message?: string;
  error?: Error | { response?: { status: number; statusText?: string }; message?: string };
  retry?: () => void;
  showDetails?: boolean;
}

export default function ErrorMessage({ 
  message = 'Something went wrong', 
  error,
  retry,
  showDetails = false 
}: ErrorMessageProps) {
  const getErrorDetails = () => {
    if (!error) return null;
    
    if ('response' in error && error.response?.status) {
      return `${error.response.status}: ${error.response.statusText || 'API Error'}`;
    }
    
    if ('message' in error && error.message) {
      return error.message;
    }
    
    return String(error);
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-600"
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
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              WordPress API Error
            </h3>
            <p className="text-red-700 mb-2">{message}</p>
            
            {showDetails && errorDetails && (
              <div className="bg-red-100 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-800 font-medium mb-1">Error Details:</p>
                <code className="text-xs text-red-800 break-all">
                  {errorDetails}
                </code>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {retry && (
                <button
                  onClick={retry}
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <a 
                href="https://vladclaudecode.wpenginepowered.com/wp-json/wp/v2/posts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Test WordPress API
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}