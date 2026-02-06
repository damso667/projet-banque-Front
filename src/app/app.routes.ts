import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Dashboad } from './dashboad/dashboad';
import { VirementComponent } from './virement.component/virement.component';
import { RechargeComponent } from './recharge.component/recharge.component';
import { ProfileComponent } from './profile.component/profile.component';
import { CaissierDashboardComponent } from './caissier-dashboard.component/caissier-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard.component/admin-dashboard.component';


export const routes: Routes = [
    {path: '', component: Home},
    {path:'login', component: Login},
    
{path: 'dashboard', component:Dashboad}, 
{path: 'virement', component:VirementComponent} ,  
{path: 'recharge', component:RechargeComponent},
{path: 'profil', component:ProfileComponent},
{ path: 'caissier-dashboard', component: CaissierDashboardComponent },
{ path: 'admin-dashboard', component: AdminDashboardComponent }






   

];
