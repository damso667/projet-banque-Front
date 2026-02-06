import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';
import { CaissierService, CompteInfo } from '../service/caissier-service';

@Component({
  selector: 'app-caissier-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './caissier-dashboard.component.html',
  styleUrl: './caissier-dashboard.component.css'
})
export class CaissierDashboardComponent implements OnInit {
  
  // ===== DONNÉES =====
  compteRecherche: CompteInfo | null = null;  // Compte trouvé
  
  // ===== RECHERCHE =====
  searchQuery: string = '';  // Requête de recherche (email ou nom d'utilisateur)
  isSearching: boolean = false;  // Indicateur de recherche
  searchError: string = '';  // Erreur de recherche
  
  // ===== OPÉRATIONS =====
  montantOperation: number = 0;  // Montant pour dépôt/retrait
  activeOperation: string = '';  // 'depot' ou 'retrait'
  isProcessing: boolean = false;  // Indicateur de traitement
  operationSuccess: string = '';  // Message de succès
  operationError: string = '';  // Message d'erreur
  
  // ===== HISTORIQUE DES OPÉRATIONS DU JOUR =====
  historiqueOperations: any[] = [];  // Liste des opérations effectuées
  
  // ===== NAVIGATION =====
  activeSection: string = 'recherche';  // Section active
  isMobileMenuOpen: boolean = false;  // Menu mobile

  constructor(
    private caissierService: CaissierService,
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Vérifie si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  // ===== RECHERCHER UN COMPTE =====
  rechercherCompte(): void {
    // Vérifie que la recherche n'est pas vide
    if (!this.searchQuery.trim()) {
      this.searchError = 'Veuillez saisir un email ou nom d\'utilisateur';
      return;
    }
    
    this.isSearching = true;
    this.searchError = '';
    this.compteRecherche = null;

    this.caissierService.rechercherCompte(this.searchQuery).subscribe({
      next: (compte) => {
        console.log('Compte trouvé:', compte);
        this.isSearching = false;
        this.compteRecherche = compte;
        
        // Passe automatiquement à la section opération
        this.activeSection = 'operation';
      },
      error: (error) => {
        console.error('Erreur recherche:', error);
        this.isSearching = false;
        
        if (error.status === 404) {
          this.searchError = 'Aucun compte trouvé avec cet identifiant';
        } else {
          this.searchError = 'Erreur lors de la recherche';
        }
      }
    });
  }

  // ===== SÉLECTIONNER UNE OPÉRATION =====
  selectOperation(type: string): void {
    this.activeOperation = type;
    this.montantOperation = 0;
    this.resetMessages();
  }

  // ===== EFFECTUER UN DÉPÔT =====
// ===== EFFECTUER UN DÉPÔT =====
effectuerDepot(): void {
  if (!this.isValidOperation()) {
    return;
  }
  
  this.isProcessing = true;
  this.resetMessages();

  this.caissierService.effectuerDepot(
    this.compteRecherche!.numeroCompte,
    this.montantOperation
  ).subscribe({
    next: (response) => {
      console.log('Dépôt réussi:', response);
      this.isProcessing = false;
      this.operationSuccess = response.message || 'Dépôt effectué avec succès';  // ← Utilise response.message
      
      // Met à jour le solde localement
      this.compteRecherche!.solde += this.montantOperation;
      
      // Ajoute à l'historique
      this.ajouterHistorique('DEPOT', this.montantOperation);
      
      // Réinitialise après 2 secondes
      setTimeout(() => {
        this.resetOperation();
      }, 2000);
    },
    error: (error) => {
      console.error('Erreur dépôt:', error);
      this.isProcessing = false;
      this.operationError = error.error?.message || 'Erreur lors du dépôt';  // ← Utilise error.error.message
    }
  });
}

// ===== EFFECTUER UN RETRAIT =====
effectuerRetrait(): void {
  if (!this.isValidOperation()) {
    return;
  }
  
  // Vérifie que le solde est suffisant
  if (this.montantOperation > this.compteRecherche!.solde) {
    this.operationError = 'Solde insuffisant pour ce retrait';
    return;
  }
  
  this.isProcessing = true;
  this.resetMessages();

  this.caissierService.effectuerRetrait(
    this.compteRecherche!.numeroCompte,
    this.montantOperation
  ).subscribe({
    next: (response) => {
      console.log('Retrait réussi:', response);
      this.isProcessing = false;
      this.operationSuccess = response.message || 'Retrait effectué avec succès';  // ← Utilise response.message
      
      // Met à jour le solde localement
      this.compteRecherche!.solde -= this.montantOperation;
      
      // Ajoute à l'historique
      this.ajouterHistorique('RETRAIT', this.montantOperation);
      
      // Réinitialise après 2 secondes
      setTimeout(() => {
        this.resetOperation();
      }, 2000);
    },
    error: (error) => {
      console.error('Erreur retrait:', error);
      this.isProcessing = false;
      this.operationError = error.error?.message || 'Erreur lors du retrait';  // ← Utilise error.error.message
    }
  });
}

  // ===== VALIDATION DE L'OPÉRATION =====
  isValidOperation(): boolean {
    if (!this.compteRecherche) {
      this.operationError = 'Aucun compte sélectionné';
      return false;
    }
    
    if (this.montantOperation <= 0) {
      this.operationError = 'Le montant doit être supérieur à 0';
      return false;
    }
    
    return true;
  }

  // ===== AJOUTER À L'HISTORIQUE =====
  ajouterHistorique(type: string, montant: number): void {
    this.historiqueOperations.unshift({
      type: type,
      montant: montant,
      client: `${this.compteRecherche!.client.prenom} ${this.compteRecherche!.client.nom}`,
      numeroCompte: this.compteRecherche!.numeroCompte,
      date: new Date(),
      nouveauSolde: this.compteRecherche!.solde
    });
  }

  // ===== RÉINITIALISER L'OPÉRATION =====
  resetOperation(): void {
    this.montantOperation = 0;
    this.activeOperation = '';
    this.operationSuccess = '';
    this.operationError = '';
  }

  // ===== RÉINITIALISER LES MESSAGES =====
  resetMessages(): void {
    this.operationSuccess = '';
    this.operationError = '';
  }

  // ===== NOUVELLE RECHERCHE =====
  nouvelleRecherche(): void {
    this.compteRecherche = null;
    this.searchQuery = '';
    this.searchError = '';
    this.resetOperation();
    this.activeSection = 'recherche';
  }

  // ===== FORMATER LA DATE =====
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ===== CHANGER DE SECTION =====
  navigateTo(section: string): void {
    this.activeSection = section;
    this.isMobileMenuOpen = false;
  }

  // ===== TOGGLE MENU MOBILE =====
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ===== DÉCONNEXION =====
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}