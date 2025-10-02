import { LoadingSpinner } from "./LoadingSpinner";

interface LoaderProps {
  loading: boolean;
  error?: string | null;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Loader = ({
  loading,
  error,
  message,
  children,
  className = "",
}: LoaderProps) => {
  if (error) {
    const isNetworkError = error.includes("connexion internet");
    const isApiError = error.includes("réessayer ultérieurement");
    const isNotFoundError = error.includes("Aucun film trouvé");

    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {isNetworkError && (
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
              )}
              {isApiError && (
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {isNotFoundError && (
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {!isNetworkError && !isApiError && !isNotFoundError && (
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isNetworkError && "Problème de connexion"}
                {isApiError && "Service indisponible"}
                {isNotFoundError && "Aucun résultat"}
                {!isNetworkError && !isApiError && !isNotFoundError && "Erreur"}
              </h3>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <LoadingSpinner />
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    );
  }

  return <>{children}</>;
};