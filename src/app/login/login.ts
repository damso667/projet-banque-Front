import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isSignUpMode: boolean = false;

  // Variables de connexion
  identifier: string = '';
  motDePasseLogin: string = '';

  // Variables d'inscription
  nomUtilisateur: string = '';
  motDePasseRegister: string = '';
  email: string = '';
  nom: string = '';
  prenom: string = '';
  adresse: string = '';
  telephone: string = '';
  
  // Messages
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  // ===== CONNEXION =====
  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login(this.identifier, this.motDePasseLogin)
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie!', response);
          this.isLoading = false;
          this.successMessage = 'Connexion réussie!';
          
          // ===== REDIRECTION SELON LE RÔLE =====
          // Vérifie le premier rôle dans la liste
          const role = response.roles[0]; // Prend le premier rôle
          
          console.log('Rôle détecté:', role);
          
          if (role === 'ROLE_CAISSIER') {
            // Redirige vers le dashboard caissier
            this.router.navigate(['/caissier-dashboard']);
          } else if (role === 'ROLE_CLIENT') {
            // Redirige vers le dashboard client
            this.router.navigate(['/dashboard']);
          } else if (role === 'ROLE_ADMIN') {
            // Redirige vers le dashboard admin (à créer)
            this.router.navigate(['/admin-dashboard']);
          } else {
            // Par défaut, redirige vers le dashboard client
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.isLoading = false;
          this.errorMessage = 'Identifiant ou mot de passe incorrect';
        }
      });
  }

  // ===== INSCRIPTION =====
  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const registrationData = {
      nomUtilisateur: this.nomUtilisateur,
      motDePasse: this.motDePasseRegister,
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      adresse: this.adresse,
      telephone: this.telephone
    };

    this.authService.register(registrationData)
      .subscribe({
        next: (response) => {
          console.log('Inscription réussie!', response);
          this.isLoading = false;
          this.successMessage = 'Inscription réussie! Vous pouvez maintenant vous connecter.';
          
          setTimeout(() => {
            this.toggleLogin();
            this.resetForm();
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur d\'inscription', error);
          this.isLoading = false;
          this.errorMessage = error.error || 'Une erreur est survenue lors de l\'inscription';
        }
      });
  }

  toggleSignUp(): void {
    this.isSignUpMode = true;
    this.resetMessages();
  }

  toggleLogin(): void {
    this.isSignUpMode = false;
    this.resetMessages();
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  resetForm(): void {
    this.identifier = '';
    this.motDePasseLogin = '';
    this.nomUtilisateur = '';
    this.motDePasseRegister = '';
    this.email = '';
    this.nom = '';
    this.prenom = '';
    this.adresse = '';
    this.telephone = '';
    this.resetMessages();
  }

  goToHome(): void {
    this.router.navigate(['']);
  }
}