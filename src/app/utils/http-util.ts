import { HttpHeaders } from '@angular/common/http';

export class HttpUtil {
    // static API_BASE_URL = 'http://localhost:3000';
    static API_BASE_URL = 'https://agile-everglades-18086.herokuapp.com/';

    static makeHttpOptions(): any {
        const headersObj = Object.assign(
            { 'Content-Type': 'application/json' },
            localStorage.getItem('token') ?
                { 'Authorization': `Bearer ${localStorage.getItem('token')}` } :
                {}
        );

        return {
            headers: new HttpHeaders(headersObj),
            withCredentials: true,
        };
    }
}
