import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Helper } from '../shared/helpers';

export class SharedService {

  public static baseUrl = environment.baseUrl;
  public static inventoryUrl = `${SharedService.baseUrl}/api/inventory`;
  public static adminUrl = `${SharedService.baseUrl}/api/admin`;

  public static getListParams(page, limit, sort): HttpParams {
    let httpParams: HttpParams = new HttpParams()
    .set('_page', page)
    .set('_limit', limit)
    .set('sort', sort);
    return httpParams;
  }

  clearScan() {
    localStorage.removeItem('scan-count');
    localStorage.removeItem('barcodes')
    localStorage.removeItem('scanned_summary_id');
  }
}