import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignXComponent } from './sign-x/sign-x.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { InMemoryDataService } from './services/in-memory-data.service';
import { BookLibraryComponent } from './book-library/book-library.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookshelvesComponent } from './bookshelves/bookshelves.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { HTTP_CONSTANTS, API_HTTP_CONSTANTS } from './constants/http-constants';
import { ReviewComponent } from './review/review.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { AccountComponent } from './settings/account/account.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MessageComponent } from './message/message.component';
import { NewlinePipe } from './pipes/newline.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignXComponent,
    SignUpComponent,
    SignInComponent,
    UserMenuComponent,
    BookshelfComponent,
    PageNotFoundComponent,
    BookLibraryComponent,
    BookDetailComponent,
    BookshelvesComponent,
    ReviewComponent,
    SettingsComponent,
    ProfileComponent,
    AccountComponent,
    AdminDashboardComponent,
    MessageComponent,
    NewlinePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  providers: [
    { provide: HTTP_CONSTANTS, useValue: API_HTTP_CONSTANTS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
