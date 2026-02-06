import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../service/auth';
import { ClientService, Compte, Transaction } from '../service/client-service';
import { VirementComponent } from "../virement.component/virement.component";
import { RechargeComponent } from "../recharge.component/recharge.component";
import { ProfileComponent } from "../profile.component/profile.component";

@Component({
  selector: 'app-dashboad',
  standalone: true,
  imports: [CommonModule, NgIf, VirementComponent, RechargeComponent, ProfileComponent],
  templateUrl: './dashboad.html',
  styleUrl: './dashboad.css'
})
export class Dashboad implements OnInit {
  
  // ===== DONNÉES DU PROFIL =====
  compte: Compte | null = null;  // Informations du compte bancaire
  
  // ===== DONNÉES DES TRANSACTIONS =====
  transactions: Transaction[] = [];  // Liste des transactions
  
  // ===== ÉTAT DE L'INTERFACE =====
  isLoading: boolean = true;  // Indicateur de chargement
  errorMessage: string = '';  // Message d'erreur
  
  // ===== NAVIGATION =====
  activeSection: string = 'overview';  // Section active du dashboard
  // Sections possibles : 'overview', 'transactions', 'virement', 'recharge', 'profile'
  
  // ===== MENU MOBILE =====
  isMobileMenuOpen: boolean = false;  // État du menu sur mobile

  constructor(
    private clientService: ClientService,
    private authService: Auth,
    private router: Router
  ) { }

  // ===== INITIALISATION DU COMPOSANT =====
  ngOnInit(): void {
    // Charge les données au démarrage
    this.loadDashboardData();
  }

  // ===== CHARGER TOUTES LES DONNÉES =====
  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Charge le profil
    this.clientService.getMonProfil().subscribe({
      next: (data) => {
        this.compte = data;
        console.log('Profil chargé:', data);
        
        // Une fois le profil chargé, charge les transactions
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Erreur chargement profil:', error);
        this.errorMessage = 'Impossible de charger votre profil';
        this.isLoading = false;
        
        // Si erreur 401 (non autorisé), redirige vers login
        if (error.status === 401) {
          this.logout();
        }
      }
    });
  }

  // ===== CHARGER LES TRANSACTIONS =====
  loadTransactions(): void {
    this.clientService.getMesTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        console.log('Transactions chargées:', data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement transactions:', error);
        // On continue même si les transactions ne chargent pas
        this.isLoading = false;
      }
    });
  }

  // ===== CALCULER LE TOTAL DES DÉPENSES =====
  getTotalDepenses(): number {
    if (!this.transactions || this.transactions.length === 0) {
      return 0;
    }
    
    // Somme tous les montants négatifs (dépenses)
    return this.transactions
      .filter(t => t.montant < 0)
      .reduce((sum, t) => sum + Math.abs(t.montant), 0);
  }

  // ===== CALCULER LE TOTAL DES REVENUS =====
  getTotalRevenus(): number {
    if (!this.transactions || this.transactions.length === 0) {
      return 0;
    }
    
    // Somme tous les montants positifs (revenus)
    return this.transactions
      .filter(t => t.montant > 0)
      .reduce((sum, t) => sum + t.montant, 0);
  }

  // ===== OBTENIR LES DERNIÈRES TRANSACTIONS =====
  getDernieresTransactions(limite: number = 5): Transaction[] {
    if (!this.transactions) {
      return [];
    }
    
    // Trie par date décroissante et prend les X premières
    return [...this.transactions]
      .sort((a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime())
      .slice(0, limite);
  }

  // ===== FORMATER UNE DATE =====
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ===== CHANGER DE SECTION =====
  navigateTo(section: string): void {
    this.activeSection = section;
    this.isMobileMenuOpen = false;  // Ferme le menu mobile
  }

  // ===== TOGGLE MENU MOBILE =====
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ===== RAFRAÎCHIR LES DONNÉES =====
  refresh(): void {
    this.loadDashboardData();
  }

  // ===== DÉCONNEXION =====
  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}