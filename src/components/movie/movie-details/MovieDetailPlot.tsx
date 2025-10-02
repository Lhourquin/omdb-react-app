interface MovieDetailPlotProps {
  plot: string;
}

export const MovieDetailPlot = ({ plot }: MovieDetailPlotProps) => {
  if (plot === "N/A") return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Synopsis</h3>
      <p className="text-gray-700 leading-relaxed text-base">{plot}</p>
    </div>
  );
};