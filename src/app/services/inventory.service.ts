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

  get_checkBarcodeExist(barcode: string, scannedSummaryId: number) {
    let prm = new HttpParams().set('barcode', barcode);
    if (scannedSummaryId !== 0) {
      prm = prm.append('scanned_summary_id', `${scannedSummaryId}`);
    }
    return this.http.get(`${this.inventoryUrl}/check-barcode`, { params: prm });
  }

  get_productCategoryList() {
    return this.http.get(`${this.inventoryUrl}/product-category`);
  }

  get_productCapacityList(id) {
    const prm = new HttpParams().set('category_id', id);
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

  get_scannedBatchQRCodeAll(scannedSummaryId) {
    return this.http.get(`${this.inventoryUrl}/product-summary/${scannedSummaryId}/qr-codes`, { responseType: 'blob' }).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }

  get_scannedBatchQRCode(scannedSummaryId, scannedBatchId) {
    return this.http.get(`${this.inventoryUrl}/product-summary/${scannedSummaryId}/scanned_batch/${scannedBatchId}`,
    { responseType: 'blob' }).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }

  get_productBatchList(id, expired, expires) {
    const prm = new HttpParams()
    .set('expired', `${expired}`)
    .set('expires', `${expires}`);
    return this.http.get(`${this.inventoryUrl}/product/${id}/product-batches`, { params: prm });
  }

  get_productVariantList(id) {
    return this.http.get(`${this.inventoryUrl}/product/${id}/product-variants`);
  }

  get_productVariant(productId, productVariantId) {
    return this.http.get(`${this.inventoryUrl}/product/${productId}/product-variant/${productVariantId}`);
  }

  get_productTradeOfferList(id, page, limit) {
    const prm = new HttpParams()
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

  post_updatePromotion(productId, promotionId, o) {
    return this.http.post(`${this.inventoryUrl}/product/${productId}/promotion/${promotionId}`, o);
  }

  delete_promotion(productId, promotionId) {
    return this.http.delete(`${this.inventoryUrl}/product/${productId}/promotion/${promotionId}`);
  }
}
