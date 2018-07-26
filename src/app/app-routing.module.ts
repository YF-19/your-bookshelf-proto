import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignXComponent } from './sign-x/sign-x.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookLibraryComponent } from './book-library/book-library.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookshelvesComponent } from './bookshelves/bookshelves.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { AccountComponent } from './settings/account/account.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-x', pathMatch: 'full' },
  {
    path: 'sign-x',
    component: SignXComponent,
    children: [
      { path: '', redirectTo: 'up', pathMatch: 'full' },
      // { path: 'sign-up', component: SignUpComponent },
      // { path: 'sign-in', component: SignInComponent },
      { path: 'up', component: SignUpComponent },
      { path: 'in', component: SignInComponent }
    ]
  },
  { path: 'bookshelves/:id', component: BookshelfComponent },
  { path: 'bookshelves', component: BookshelvesComponent },
  { path: 'library', component: BookLibraryComponent },
  {
    path: 'books/:isbn',
    component: BookDetailComponent,
    children: [
      { path: 'users/:user_id', component: BookDetailComponent },
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'account', component: AccountComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
