import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== INTERFACES =====

interface CompteAdmin {
  id: number;
  numeroCompte: string;
  solde: number;
  typeCompte: string;
  actif: boolean;
  dateCreation: string;
  devise: string;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
}

interface UtilisateurAdmin {
  id: number;
  nomUtilisateur: string;
  email: string;
  role: string;
  actif: boolean;
  nom?: string;
  prenom?: string;
  telephone?: string;
}

interface CreerCaissierRequest {
  nomUtilisateur: string;
  email: string;
  motDePasse: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private apiUrl = 'https://projet-bancaire.onrender.com/api/admin';

  constructor(private http: HttpClient) { }

  // ===== COMPTES =====
  getTousLesComptes(): Observable<CompteAdmin[]> {
    return this.http.get<CompteAdmin[]>(`${this.apiUrl}/comptes`);
  }

  changerStatutCompte(numeroCompte: string, actif: boolean): Observable<any> {
    const params = new HttpParams().set('actif', actif.toString());
    return this.http.patch(`${this.apiUrl}/comptes/${numeroCompte}/statut`, {}, { params });
  }

  // ===== UTILISATEURS =====
  getTousLesUtilisateurs(): Observable<UtilisateurAdmin[]> {
    return this.http.get<UtilisateurAdmin[]>(`${this.apiUrl}/utilisateurs`);
  }

  rechercherUtilisateur(query: string): Observable<UtilisateurAdmin> {
    const params = new HttpParams().set('query', query);
    return this.http.get<UtilisateurAdmin>(`${this.apiUrl}/utilisateurs/recherche`, { params });
  }

  rechercheGlobale(q: string): Observable<UtilisateurAdmin[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<UtilisateurAdmin[]>(`${this.apiUrl}/utilisateurs/search`, { params });
  }

  creerCaissier(data: CreerCaissierRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilisateurs/caissier`, data);
  }
}

export type { CompteAdmin, UtilisateurAdmin, CreerCaissierRequest };