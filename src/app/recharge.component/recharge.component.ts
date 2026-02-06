import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../service/client-service';

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './recharge.component.html',
  styleUrl: './recharge.component.css'
})
export class RechargeComponent {
  
  // ===== DONNÉES DU FORMULAIRE =====
  montant: number = 0;              // Montant à recharger
  
  // ===== MONTANTS RAPIDES PRÉDÉFINIS =====
  montantsRapides: number[] = [20000, 30000, 50000, 100000, 150000, 200000];
  
  // ===== ÉTAT DU COMPOSANT =====
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // ===== EVENT EMITTER =====
  @Output() rechargeEffectuee = new EventEmitter<void>();

  constructor(private clientService: ClientService) { }

  // ===== SÉLECTIONNER UN MONTANT RAPIDE =====
  selectMontant(montant: number): void {
    this.montant = montant;
    this.errorMessage = '';  // Réinitialise les erreurs
  }

  // ===== VALIDATION =====
  isValid(): boolean {
    return this.montant > 0;
  }

  // ===== SOUMETTRE LA RECHARGE =====
  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Veuillez saisir un montant supérieur à 0';
      return;
    }
    
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Appelle le service
    this.clientService.rechargerCompte(this.montant).subscribe({
      next: (response) => {
        console.log('Recharge réussie:', response);
        this.isLoading = false;
        this.successMessage = response || 'Votre compte a été rechargé avec succès !';
        
        // Réinitialise après 2 secondes
        setTimeout(() => {
          this.resetForm();
          // Émet l'événement
          this.rechargeEffectuee.emit();
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur recharge:', error);
        this.isLoading = false;
        this.errorMessage = error.error || 'Une erreur est survenue lors de la recharge';
      }
    });
  }

  // ===== RÉINITIALISER =====
  resetForm(): void {
    this.montant = 0;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ===== EMPÊCHER MONTANTS NÉGATIFS =====
  onMontantChange(): void {
    if (this.montant < 0) {
      this.montant = 0;
    }
  }
}