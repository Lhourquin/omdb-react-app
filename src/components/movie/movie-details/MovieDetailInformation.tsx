import type { MovieDetail } from "../../../types/Movie.type";

interface MovieDetailInformationProps {
  movieDetails: MovieDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <div className="text-sm font-semibold text-gray-500 mb-1">{label}</div>
    <div className="text-gray-900">{value}</div>
  </div>
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Informations détaillées</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {validItems.map((item) => (
          <InfoRow
            key={item.key}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};