import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== INTERFACES =====

// Requête pour dépôt/retrait
interface OperationRequest {
  numeroCompte: string;
  montant: number;
}

// Informations du compte trouvé
interface CompteInfo {
  id: number;
  numeroCompte: string;
  solde: number;
  typeCompte: string;
  actif: boolean;
  devise: string;
  client: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    adresse: string;
    utilisateur: {
      nomUtilisateur: string;
      email: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class CaissierService {
  
  private apiUrl = 'http://localhost:8080/api/guichet';

  constructor(private http: HttpClient) { }

  // ===== RECHERCHER UN COMPTE =====
  rechercherCompte(query: string): Observable<CompteInfo> {
    // Crée les paramètres de requête
    const params = new HttpParams().set('query', query);
    
    // Appelle GET /api/guichet/recherche-compte?query=...
    return this.http.get<CompteInfo>(`${this.apiUrl}/recherche-compte`, { params });
  }

// ===== EFFECTUER UN DÉPÔT =====
effectuerDepot(numeroCompte: string, montant: number): Observable<any> {
  const request: OperationRequest = {
    numeroCompte: numeroCompte,
    montant: montant
  };
  
  // Le backend renvoie maintenant un objet JSON
  return this.http.post(`${this.apiUrl}/depot`, request);
}

// ===== EFFECTUER UN RETRAIT =====
effectuerRetrait(numeroCompte: string, montant: number): Observable<any> {
  const request: OperationRequest = {
    numeroCompte: numeroCompte,
    montant: montant
  };
  
  // Le backend renvoie maintenant un objet JSON
  return this.http.post(`${this.apiUrl}/retrait`, request);
}
}

// Exporte les interfaces
export type { CompteInfo, OperationRequest };