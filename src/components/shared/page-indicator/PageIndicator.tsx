interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  currentPage,
  totalPages,
}) => {
  if (totalPages === 0) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-sm">
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span className="text-sm font-semibold">
        Page {currentPage} / {totalPages}
      </span>
    </div>
  );
};

