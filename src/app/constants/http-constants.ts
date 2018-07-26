import { HttpHeaders } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export const API_HTTP_CONSTANTS = {
    baseUrl: 'http://localhost:3000',

    httpOptions: {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '
        }),
        withCredentials: true,
    }
};

export const HTTP_CONSTANTS = new InjectionToken('');
