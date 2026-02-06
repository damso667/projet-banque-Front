import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
// Interface pour la réponse du serveur lors de la connexion
interface JwtResponse {
  token: string;        // Le token JWT reçu
  username: string;     // Le nom d'utilisateur
  roles: string[];      // Les rôles (ex: ["CLIENT"])
}

// Interface pour les données de connexion
interface LoginRequest {
  identifier: string;   // Nom d'utilisateur ou email
  motDePasse: string;   // Mot de passe
}

// Interface pour les données d'inscription
interface RegistrationRequest {
  nomUtilisateur: string;
  motDePasse: string;
  email: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
}
@Injectable({
  providedIn: 'root',
})
export class Auth {
    // URL de ton API backend
  private apiUrl = 'http://localhost:8080/api/auth';
  
  // Le nom de la clé pour stocker le token dans le navigateur
  private TOKEN_KEY = 'auth-token';

  // HttpClient permet de faire des appels HTTP vers ton backend
  constructor(private http: HttpClient) { }

  // ===== MÉTHODE DE CONNEXION =====
  login(identifier: string, motDePasse: string): Observable<JwtResponse> {
    // Prépare les données à envoyer
    const loginData: LoginRequest = {
      identifier: identifier,
      motDePasse: motDePasse
    };

    // Envoie la requête POST vers /api/auth/connexion
    // tap() permet d'exécuter une action quand on reçoit la réponse
    return this.http.post<JwtResponse>(`${this.apiUrl}/connexion`, loginData)
      .pipe(
        tap(response => {
          // Quand on reçoit la réponse, on sauvegarde le token
          this.saveToken(response.token);
        })
      );
  }

  // ===== MÉTHODE D'INSCRIPTION =====
register(data: RegistrationRequest): Observable<any> {
  // Spécifie que la réponse est du texte, pas du JSON
  return this.http.post(`${this.apiUrl}/inscription`, data, {
    responseType: 'text'  // ← IMPORTANT : indique qu'on attend du texte
  });
}

  // ===== SAUVEGARDER LE TOKEN =====
  private saveToken(token: string): void {
    // Sauvegarde le token dans le localStorage du navigateur
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // ===== RÉCUPÉRER LE TOKEN =====
  getToken(): string | null {
    // Récupère le token depuis le localStorage
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ===== VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ =====
  isLoggedIn(): boolean {
    // Retourne true si un token existe
    return this.getToken() !== null;
  }

  // ===== DÉCONNEXION =====
  logout(): void {
    // Supprime le token du localStorage
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
}
