export class NetworkError extends Error {
  constructor(message = "Problème de connexion internet. Veuillez vérifier votre connexion.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ApiError extends Error {
  constructor(message = "Oups, nous rencontrons un problème. Veuillez réessayer ultérieurement.") {
    super(message);
    this.name = "ApiError";
  }
}

export class MovieNotFoundError extends Error {
  constructor(query: string) {
    super(`Aucun film trouvé pour "${query}".`);
    this.name = "MovieNotFoundError";
  }
}
