import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'add-car', loadChildren: './pages/add-car/add-car.module#AddCarPageModule' },
  { path: 'new-order', loadChildren: './pages/new-order/new-order.module#NewOrderPageModule' },
  { path: 'track-order', loadChildren: './pages/track-order/track-order.module#TrackOrderPageModule' },
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  { path: 'view-orders', loadChildren: './pages/view-orders/view-orders.module#ViewOrdersPageModule' },
  { path: 'view-feedbacks', loadChildren: './pages/view-feedbacks/view-feedbacks.module#ViewFeedbacksPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
