import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailInformationProps {
  movieDetails: MovieDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="py-3 px-4 font-semibold text-gray-700 w-1/3">{label}</td>
    <td className="py-3 px-4 text-gray-900">{value}</td>
  </tr>
);

export const MovieDetailInformation = ({ movieDetails }: MovieDetailInformationProps) => {
  const infoItems = [
    { key: 'Rated', label: 'Classification', value: movieDetails.Rated },
    { key: 'Released', label: 'Date de sortie', value: movieDetails.Released },
    { key: 'Runtime', label: 'Durée', value: movieDetails.Runtime },
    { key: 'Genre', label: 'Genre', value: movieDetails.Genre },
    { key: 'Director', label: 'Réalisateur', value: movieDetails.Director },
    { key: 'Writer', label: 'Scénariste', value: movieDetails.Writer },
    { key: 'Actors', label: 'Acteurs', value: movieDetails.Actors },
    { key: 'Language', label: 'Langue', value: movieDetails.Language },
    { key: 'Country', label: 'Pays', value: movieDetails.Country },
    { key: 'Awards', label: 'Récompenses', value: movieDetails.Awards },
    { key: 'Metascore', label: 'Metascore', value: movieDetails.Metascore },
    { key: 'imdbRating', label: 'Note IMDb', value: movieDetails.imdbRating },
    { key: 'imdbVotes', label: 'Votes IMDb', value: movieDetails.imdbVotes },
    { key: 'BoxOffice', label: 'Box Office', value: movieDetails.BoxOffice },
    { key: 'Production', label: 'Production', value: movieDetails.Production },
    { key: 'DVD', label: 'Sortie DVD', value: movieDetails.DVD },
    { key: 'Website', label: 'Site Web', value: movieDetails.Website },
  ];

  const validItems = infoItems.filter(item => item.value && item.value !== "N/A");

  if (validItems.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Informations détaillées</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
            {validItems.map((item) => (
              <InfoRow
                key={item.key}
                label={item.label}
                value={item.value}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};