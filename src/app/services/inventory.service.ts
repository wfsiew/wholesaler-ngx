import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { Helper } from '../shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private inventoryUrl = SharedService.inventoryUrl;

  constructor(private http: HttpClient) { }

  get_productList(term, page, limit, sort, category) {
    let prm = SharedService.getListParams(page, limit, sort);
    if (!Helper.isEmpty(term)) {
      prm = prm.append('term', term);
    }

    if (!Helper.isEmpty(category)) {
      prm = prm.append('category', category);
    }
    
    return this.http.get(`${this.inventoryUrl}/products`, { params: prm, observe: 'response' });
  }

  get_checkBarcodeExist(barcode: string, scanned_summary_id: number) {
    let prm = new HttpParams().set('barcode', barcode);
    if (scanned_summary_id != 0) {
      prm = prm.append('scanned_summary_id', `${scanned_summary_id}`);
    }
    
    return this.http.get(`${this.inventoryUrl}/check-barcode`, { params: prm });
  }

  get_productCategoryList() {
    return this.http.get(`${this.inventoryUrl}/product-category`);
  }

  get_productCapacityList(id) {
    let prm = new HttpParams().set('category_id', id);
    return this.http.get(`${this.inventoryUrl}/product-capacity`, { params: prm });
  }

  get_productQtyList() {
    return this.http.get(`${this.inventoryUrl}/product-quantity`);
  }

  post_addProduct(formData) {
    return this.http.post(`${this.inventoryUrl}/product`, formData);
  }

  put_addProduct(formData) {
    return this.http.put(`${this.inventoryUrl}/product`, formData);
  }

  put_updateProduct(formData: FormData, id) {
    return this.http.put(`${this.inventoryUrl}/product/${id}`, formData);
  }

  post_addBatch(o) {
    return this.http.post(`${this.inventoryUrl}/add-batch`, o);
  }

  get_productLookup(name) {
    const prm = new HttpParams().set('name', name);
    return this.http.get(`${this.inventoryUrl}/product`, { params: prm });
  }

  get_product(id) {
    return this.http.get(`${this.inventoryUrl}/product/${id}`);
  }

  get_addBatchResponse(id) {
    return this.http.get(`${this.inventoryUrl}/add-batch-resp/${id}`);
  }

  get_scannedBatchQRCodeAll(scanned_summary_id) {
    return this.http.get(`${this.inventoryUrl}/product-summary/${scanned_summary_id}/qr-codes`, { responseType: 'blob' }).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }

  get_scannedBatchQRCode(scanned_summary_id, scanned_batch_id) {
    return this.http.get(`${this.inventoryUrl}/product-summary/${scanned_summary_id}/scanned_batch/${scanned_batch_id}`, { responseType: 'blob' }).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }

  get_productBatchList(id, expired='', expires='') {
    let prm = new HttpParams()
    .set('expired', `${expired}`)
    .set('expires', `${expires}`);
    return this.http.get(`${this.inventoryUrl}/product/${id}/product-batches`, { params: prm });
  }

  get_productVariantList(id) {
    return this.http.get(`${this.inventoryUrl}/product/${id}/product-variants`);
  }

  get_productVariant(product_id, product_variant_id) {
    return this.http.get(`${this.inventoryUrl}/product/${product_id}/product-variant/${product_variant_id}`);
  }

  get_productTradeOfferList(id, page, limit) {
    let prm = new HttpParams()
    .set('_page', page)
    .set('_limit', limit);
    return this.http.get(`${this.inventoryUrl}/product/${id}/trade-offers`, { params: prm, observe: 'response' });
  }

  get_productPromotionList(id) {
    return this.http.get(`${this.inventoryUrl}/product/${id}/promotions`);
  }

  post_addPromotion(id, o) {
    return this.http.post(`${this.inventoryUrl}/product/${id}/promotion`, o);
  }

  post_updatePromotion(product_id, promotion_id, o) {
    return this.http.post(`${this.inventoryUrl}/product/${product_id}/promotion/${promotion_id}`, o);
  }

  delete_promotion(product_id, promotion_id) {
    return this.http.delete(`${this.inventoryUrl}/product/${product_id}/promotion/${promotion_id}`);
  }
}