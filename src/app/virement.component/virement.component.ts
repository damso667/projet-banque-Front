import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../service/client-service';

@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, FormsModule,NgIf],
  templateUrl: './virement.component.html',
  styleUrl: './virement.component.css'
})
export class VirementComponent {
  
  // ===== DONNÉES DU FORMULAIRE =====
  numeroCompteSource: string = '';      // Compte source (celui qui envoie)
  numeroCompteDestination: string = ''; // Compte destination (celui qui reçoit)
  montant: number = 0;                  // Montant à envoyer
  description: string = '';             // Description du virement (optionnel)
  
  // ===== ÉTAT DU COMPOSANT =====
  isLoading: boolean = false;           // Indicateur de chargement
  successMessage: string = '';          // Message de succès
  errorMessage: string = '';            // Message d'erreur
  
  // ===== VALIDATION =====
  showValidationErrors: boolean = false; // Afficher les erreurs de validation
  
  // ===== EVENT EMITTER =====
  // Émet un événement vers le parent (dashboard) quand le virement est effectué
  @Output() virementEffectue = new EventEmitter<void>();

  constructor(private clientService: ClientService) { }

  // ===== VALIDATION DU FORMULAIRE =====
  isFormValid(): boolean {
    return this.numeroCompteSource.trim() !== '' &&
           this.numeroCompteDestination.trim() !== '' &&
           this.montant > 0;
  }

  // ===== SOUMETTRE LE VIREMENT =====
  onSubmit(): void {
    // Active l'affichage des erreurs
    this.showValidationErrors = true;
    
    // Vérifie si le formulaire est valide
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    // Réinitialise les messages
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Prépare les données du virement
    const virementData = {
      numeroCompteSource: this.numeroCompteSource,
      numeroCompteDestination: this.numeroCompteDestination,
      montant: this.montant,
      description: this.description || undefined
    };

    // Appelle le service
    this.clientService.effectuerVirement(virementData).subscribe({
      next: (response) => {
        console.log('Virement réussi:', response);
        this.isLoading = false;
        this.successMessage = response || 'Virement effectué avec succès !';
        
        // Réinitialise le formulaire après 2 secondes
        setTimeout(() => {
          this.resetForm();
          // Émet l'événement pour rafraîchir le dashboard
          this.virementEffectue.emit();
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur virement:', error);
        this.isLoading = false;
        this.errorMessage = error.error || 'Une erreur est survenue lors du virement';
      }
    });
  }

  // ===== RÉINITIALISER LE FORMULAIRE =====
  resetForm(): void {
    this.numeroCompteSource = '';
    this.numeroCompteDestination = '';
    this.montant = 0;
    this.description = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.showValidationErrors = false;
  }

  // ===== FORMATER LE MONTANT PENDANT LA SAISIE =====
  onMontantChange(): void {
    // Empêche les montants négatifs
    if (this.montant < 0) {
      this.montant = 0;
    }
  }
}