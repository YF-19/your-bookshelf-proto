import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class HttpUtil {
    static API_BASE_URL = environment.apiBaseUri;

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
