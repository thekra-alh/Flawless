import { Routes } from '@angular/router'; 
import { LandingComponent } from './pages/landing/landing'; 
import { AuthComponent } from './pages/auth/auth'; 
import { SurveyComponent } from './pages/survey/survey'; 
import { CameraComponent } from './pages/camera/camera'; 
import { ResultsComponent } from './pages/results/results'; 
export const routes: Routes = [{ path: '', component: LandingComponent },{ path: 'auth', component: AuthComponent },{ path: 'survey', component: SurveyComponent },{ path: 'camera', component: CameraComponent },{ path: 'results', component: ResultsComponent }]; 
