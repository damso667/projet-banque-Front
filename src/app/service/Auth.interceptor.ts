import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor pour ajouter automatiquement le token à chaque requête HTTP
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Récupère le token depuis le localStorage
  const token = localStorage.getItem('auth-token');
  
  // Si un token existe
  if (token) {
    // Clone la requête et ajoute le header Authorization avec le token
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Format: "Bearer ton_token_ici"
      }
    });
    
    // Envoie la requête modifiée
    return next(clonedRequest);
  }
  
  // Si pas de token, envoie la requête normale
  return next(req);
};