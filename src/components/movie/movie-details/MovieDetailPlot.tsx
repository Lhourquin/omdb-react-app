interface MovieDetailPlotProps {
  plot: string;
}

export const MovieDetailPlot = ({ plot }: MovieDetailPlotProps) => {
  if (plot === "N/A") return null;

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">Synopsis</h3>
      <p className="text-gray-700 leading-relaxed">{plot}</p>
    </div>
  );
};