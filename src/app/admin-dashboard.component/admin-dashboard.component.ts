import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';
import { AdminService, CompteAdmin, UtilisateurAdmin, CreerCaissierRequest } from '../service/admin-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  
  // ===== DONNÉES =====
  comptes: CompteAdmin[] = [];
  utilisateurs: UtilisateurAdmin[] = [];
  
  // ===== FILTRES ET RECHERCHE =====
  searchQuery: string = '';
  filteredComptes: CompteAdmin[] = [];
  filteredUtilisateurs: UtilisateurAdmin[] = [];
  
  // ===== ÉTAT =====
  isLoading: boolean = false;
  activeSection: string = 'comptes';  // 'comptes', 'utilisateurs', 'creer-caissier'
  
  // ===== MESSAGES =====
  successMessage: string = '';
  errorMessage: string = '';
  
  // ===== FORMULAIRE CAISSIER =====
  nouveauCaissier: CreerCaissierRequest = {
    nomUtilisateur: '',
    email: '',
    motDePasse: ''
  };
  
  // ===== STATISTIQUES =====
  stats = {
    totalComptes: 0,
    comptesActifs: 0,
    totalUtilisateurs: 0,
    totalClients: 0,
    totalCaissiers: 0,
    soldeTotal: 0
  };

  constructor(
    private adminService: AdminService,
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadData();
  }

  // ===== CHARGER TOUTES LES DONNÉES =====
  loadData(): void {
    this.isLoading = true;
    
    // Charge les comptes
    this.adminService.getTousLesComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.filteredComptes = data;
        this.calculerStats();
        
        // Charge les utilisateurs
        this.loadUtilisateurs();
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
        this.errorMessage = 'Erreur lors du chargement des données';
        this.isLoading = false;
      }
    });
  }

  // ===== CHARGER LES UTILISATEURS =====
  loadUtilisateurs(): void {
    this.adminService.getTousLesUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.filteredUtilisateurs = data;
        this.calculerStatsUtilisateurs();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs:', error);
        this.isLoading = false;
      }
    });
  }

  // ===== CALCULER LES STATISTIQUES =====
  calculerStats(): void {
    this.stats.totalComptes = this.comptes.length;
    this.stats.comptesActifs = this.comptes.filter(c => c.actif).length;
    this.stats.soldeTotal = this.comptes.reduce((sum, c) => sum + c.solde, 0);
  }

  calculerStatsUtilisateurs(): void {
    this.stats.totalUtilisateurs = this.utilisateurs.length;
    this.stats.totalClients = this.utilisateurs.filter(u => u.role === 'ROLE_CLIENT').length;
    this.stats.totalCaissiers = this.utilisateurs.filter(u => u.role === 'ROLE_CAISSIER').length;
  }

  // ===== RECHERCHER =====
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    
    if (this.activeSection === 'comptes') {
      this.filteredComptes = this.comptes.filter(c =>
        c.numeroCompte.toLowerCase().includes(query) ||
        c.clientNom.toLowerCase().includes(query) ||
        c.clientPrenom.toLowerCase().includes(query) ||
        c.clientEmail.toLowerCase().includes(query)
      );
    } else if (this.activeSection === 'utilisateurs') {
      this.filteredUtilisateurs = this.utilisateurs.filter(u =>
        u.nomUtilisateur.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.nom && u.nom.toLowerCase().includes(query)) ||
        (u.prenom && u.prenom.toLowerCase().includes(query))
      );
    }
  }

  // ===== BLOQUER/DÉBLOQUER UN COMPTE =====
  toggleStatutCompte(compte: CompteAdmin): void {
    const newStatut = !compte.actif;
    
    this.adminService.changerStatutCompte(compte.numeroCompte, newStatut).subscribe({
      next: (response) => {
        compte.actif = newStatut;
        this.successMessage = response.message;
        this.calculerStats();
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur changement statut:', error);
        this.errorMessage = 'Erreur lors du changement de statut';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // ===== CRÉER UN CAISSIER =====
  creerCaissier(): void {
    if (!this.nouveauCaissier.nomUtilisateur || !this.nouveauCaissier.email || !this.nouveauCaissier.motDePasse) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    
    this.isLoading = true;
    this.resetMessages();

    this.adminService.creerCaissier(this.nouveauCaissier).subscribe({
      next: (response) => {
        console.log('Caissier créé:', response);
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Réinitialise le formulaire
        this.nouveauCaissier = {
          nomUtilisateur: '',
          email: '',
          motDePasse: ''
        };
        
        // Recharge les utilisateurs
        this.loadUtilisateurs();
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur création caissier:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du caissier';
      }
    });
  }

  // ===== NAVIGATION =====
  navigateTo(section: string): void {
    this.activeSection = section;
    this.searchQuery = '';
    this.resetMessages();
  }

  // ===== RAFRAÎCHIR =====
  refresh(): void {
    this.loadData();
  }

  // ===== RÉINITIALISER LES MESSAGES =====
  resetMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ===== DÉCONNEXION =====
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ===== FORMATER LE RÔLE =====
  formatRole(role: string): string {
    return role.replace('ROLE_', '');
  }
}