import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== INTERFACES POUR LES DONNÉES =====
// Interface pour le client (nested)
interface ClientInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface Compte {
  numeroCompte: string;
  solde: number;
  dateCreation: string;
  client: ClientInfo;  // Objet imbriqué
}

// Structure d'une transaction
interface Transaction {
  id: number;
  montant: number;
  typeTransaction: string;  // "VIREMENT", "RECHARGEMENT", etc.
  dateTransaction: string;
  libelle: string;
  compteSource?: string;
  compteDestination?: string;
}

// Requête pour mettre à jour le profil
interface UpdateProfilRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

// Requête pour un virement
interface VirementRequest {
  numeroCompteSource: string;
  numeroCompteDestination: string;
  montant: number;
  libelle?: string;
}

// Requête pour un rechargement
interface RechargementRequest {
  montant: number;
}

// Requête pour changer le mot de passe
interface MdpRequest {
  ancienMdp: string;
  nouveauMdp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  // URL de base de l'API
  private apiUrl = 'https://projet-bancaire.onrender.com/api/client';
  private userApiUrl = 'https://projet-bancaire.onrender.com/api/utilisateur';

  constructor(private http: HttpClient) { }

  // ===== RÉCUPÉRER LE PROFIL DU CLIENT =====
  getMonProfil(): Observable<Compte> {
    // Appelle GET /api/client/mon-profil
    return this.http.get<Compte>(`${this.apiUrl}/mon-profil`);
  }

  // ===== RÉCUPÉRER L'HISTORIQUE DES TRANSACTIONS =====
  getMesTransactions(): Observable<Transaction[]> {
    // Appelle GET /api/client/mes-transactions
    return this.http.get<Transaction[]>(`${this.apiUrl}/mes-transactions`);
  }

  // ===== EFFECTUER UN VIREMENT =====
  effectuerVirement(virement: VirementRequest): Observable<any> {
    // Appelle POST /api/client/virement
    return this.http.post(`${this.apiUrl}/virement`, virement, {
      responseType: 'text'  // Le backend renvoie un String
    });
  }

  // ===== RECHARGER LE COMPTE =====
  rechargerCompte(montant: number): Observable<any> {
    // Prépare la requête avec le montant
    const request: RechargementRequest = { montant: montant };
    
    // Appelle POST /api/client/recharger
    return this.http.post(`${this.apiUrl}/recharger`, request, {
      responseType: 'text'  // Le backend renvoie un String
    });
  }

   updateProfil(data: UpdateProfilRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/mon-profil`, data);
  }

  // ===== CHANGER LE MOT DE PASSE =====
  changerMotDePasse(ancienMdp: string, nouveauMdp: string): Observable<any> {
    const request: MdpRequest = {
      ancienMdp: ancienMdp,
      nouveauMdp: nouveauMdp
    };
    
    // Appelle PATCH /api/utilisateur/modifier-mdp
    return this.http.patch(`${this.userApiUrl}/modifier-mdp`, request, {
      responseType: 'text'
    });
  }
}

// Exporte les interfaces pour les utiliser ailleurs
export type { Compte, Transaction, VirementRequest, RechargementRequest, UpdateProfilRequest };