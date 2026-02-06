import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, Compte, UpdateProfilRequest } from '../service/client-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  // ===== DONNÉES REÇUES DU PARENT =====
  @Input() compte!: Compte;  // Le compte passé depuis le dashboard
  
  // ===== MODES D'AFFICHAGE =====
  isEditMode: boolean = false;           // Mode édition activé ou non
  activeTab: string = 'informations';    // Onglet actif: 'informations' ou 'securite'
  
  // ===== DONNÉES MODIFIABLES (pour l'édition) =====
  editData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  };
  
  // ===== CHANGEMENT DE MOT DE PASSE =====
  passwordData = {
    ancienMdp: '',
    nouveauMdp: '',
    confirmMdp: ''
  };
  
  // ===== ÉTAT DU COMPOSANT =====
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // ===== VALIDATION MOT DE PASSE =====
  passwordErrors: string[] = [];

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    // Initialise les données d'édition avec les données du compte
    if (this.compte) {
      this.loadEditData();
    }
  }

  // ===== CHARGER LES DONNÉES DANS LE FORMULAIRE =====
  loadEditData(): void {
    this.editData = {
      nom: this.compte.client.nom,
      prenom: this.compte.client.prenom,
      email: this.compte.client.email,
      telephone: this.compte.client.telephone,
      adresse: this.compte.client.adresse
    };
  }

  // ===== CHANGER D'ONGLET =====
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.resetMessages();
  }

  // ===== ACTIVER/DÉSACTIVER MODE ÉDITION =====
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    if (!this.isEditMode) {
      // Si on annule, on recharge les données originales
      this.loadEditData();
    }
    
    this.resetMessages();
  }

  // ===== SAUVEGARDER LES MODIFICATIONS DU PROFIL =====
  // ===== SAUVEGARDER LES MODIFICATIONS DU PROFIL =====
saveProfile(): void {
  this.isLoading = true;
  this.resetMessages();
  
  // Prépare les données à envoyer
  const updateData: UpdateProfilRequest = {
    nom: this.editData.nom,
    prenom: this.editData.prenom,
    email: this.editData.email,
    telephone: this.editData.telephone,
    adresse: this.editData.adresse
  };
  
  // Appelle le service pour mettre à jour le profil
  this.clientService.updateProfil(updateData).subscribe({
    next: (response) => {
      console.log('Profil mis à jour:', response);
      
      // Mise à jour locale des données
      this.compte.client.nom = this.editData.nom;
      this.compte.client.prenom = this.editData.prenom;
      this.compte.client.email = this.editData.email;
      this.compte.client.telephone = this.editData.telephone;
      this.compte.client.adresse = this.editData.adresse;
      
      this.isLoading = false;
      this.successMessage = response.message || 'Profil mis à jour avec succès !';
      this.isEditMode = false;
      
      // Efface le message après 3 secondes
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: (error) => {
      console.error('Erreur mise à jour profil:', error);
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Impossible de mettre à jour le profil';
    }
  });
}

  // ===== VALIDER LE MOT DE PASSE =====
  validatePassword(): boolean {
    this.passwordErrors = [];
    
    // Vérifie que tous les champs sont remplis
    if (!this.passwordData.ancienMdp) {
      this.passwordErrors.push('L\'ancien mot de passe est requis');
    }
    
    if (!this.passwordData.nouveauMdp) {
      this.passwordErrors.push('Le nouveau mot de passe est requis');
    }
    
    if (!this.passwordData.confirmMdp) {
      this.passwordErrors.push('La confirmation est requise');
    }
    
    // Vérifie la longueur minimale
    if (this.passwordData.nouveauMdp && this.passwordData.nouveauMdp.length < 6) {
      this.passwordErrors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    // Vérifie que les mots de passe correspondent
    if (this.passwordData.nouveauMdp !== this.passwordData.confirmMdp) {
      this.passwordErrors.push('Les mots de passe ne correspondent pas');
    }
    
    return this.passwordErrors.length === 0;
  }

  // ===== CHANGER LE MOT DE PASSE =====
  changePassword(): void {
    if (!this.validatePassword()) {
      return;
    }
    
    this.isLoading = true;
    this.resetMessages();
    
    this.clientService.changerMotDePasse(
      this.passwordData.ancienMdp,
      this.passwordData.nouveauMdp
    ).subscribe({
      next: (response) => {
        console.log('Mot de passe changé:', response);
        this.isLoading = false;
        this.successMessage = response || 'Mot de passe modifié avec succès !';
        
        // Réinitialise le formulaire
        this.resetPasswordForm();
        
        // Efface le message après 3 secondes
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur changement mot de passe:', error);
        this.isLoading = false;
        this.errorMessage = error.error || 'Impossible de changer le mot de passe. Vérifiez votre ancien mot de passe.';
      }
    });
  }

  // ===== RÉINITIALISER LE FORMULAIRE MOT DE PASSE =====
  resetPasswordForm(): void {
    this.passwordData = {
      ancienMdp: '',
      nouveauMdp: '',
      confirmMdp: ''
    };
    this.passwordErrors = [];
  }

  // ===== RÉINITIALISER LES MESSAGES =====
  resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordErrors = [];
  }

  // ===== FORMATER LA DATE D'INSCRIPTION =====
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // ===== CALCULER L'ANCIENNETÉ =====
  getAnciennete(): string {
    const dateInscription = new Date(this.compte.dateCreation);
    const maintenant = new Date();
    const diffTime = Math.abs(maintenant.getTime() - dateInscription.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const mois = Math.floor(diffDays / 30);
      return `${mois} mois`;
    } else {
      const annees = Math.floor(diffDays / 365);
      return `${annees} an${annees > 1 ? 's' : ''}`;
    }
  }

  // ===== MASQUER LE NUMÉRO DE COMPTE =====
  getMaskedAccountNumber(): string {
    const numero = this.compte.numeroCompte;
    if (numero.length <= 4) return numero;
    
    // Affiche les 4 derniers chiffres, masque le reste
    return '•••• •••• •••• ' + numero.slice(-4);
  }
}