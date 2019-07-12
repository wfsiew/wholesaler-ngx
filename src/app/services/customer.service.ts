import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { Helper } from '../shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private inventoryUrl = SharedService.inventoryUrl;
  private adminUrl = SharedService.adminUrl;

  constructor(private http: HttpClient) { }

  get_customerList(tradeOffer, page, limit, sort) {
    const prm = SharedService.getListParams(page, limit, sort);
    const tdOffer = 1;
    if (tradeOffer) {
      return this.http.get(`${this.inventoryUrl}/customers?trade_offer=${tdOffer}`, { params: prm, observe: 'response' });
    }
    return this.http.get(`${this.inventoryUrl}/customers`, { params: prm, observe: 'response' });
  }

  get_searchCustomer(term, tradeOffer, page, limit, sort) {
    const prm = SharedService.getListParams(page, limit, sort);
    const tdOffer = 1;
    if (tradeOffer) {
      return this.http.get(`${this.inventoryUrl}/customers?term=${term}&trade_offer=${tradeOffer}`, { params: prm, observe: 'response' });
    }
    return this.http.get(`${this.inventoryUrl}/customers?term=${term}`, { params: prm, observe: 'response' });
  }

  put_customerPicture(img: File, id) {
    const formData: FormData = new FormData();
    formData.append('id', id);
    formData.append('picture', img);
    return this.http.put(`${this.inventoryUrl}/customer/profile/${id}/picture`, formData);
  }

  get_customer(id) {
    return this.http.get(`${this.inventoryUrl}/customer/profile/${id}`);
  }

  put_updateCustomer(id, o) {
    return this.http.put(`${this.inventoryUrl}/customer/profile/${id}`, o);
  }

  post_addCustomerTradeOffer(id, o) {
    return this.http.post(`${this.inventoryUrl}/customer/${id}/trade-offer`, o);
  }

  delete_tradeOffer(cusId, tradeOfferId) {
    return this.http.delete(`${this.inventoryUrl}/customer/${cusId}/trade-offer/${tradeOfferId}`);
  }
  put_updateCustomerTradeOffer(customerId, tradeOfferId, o) {
    return this.http.put(`${this.inventoryUrl}/customer/${customerId}/trade-offer/${tradeOfferId}`, o);
  }

  post_addCustomerTradeOfferPromotion(customerId, tradeOfferId, o) {
    return this.http.post(`${this.inventoryUrl}/customer/${customerId}/trade-offer/${tradeOfferId}/promotion`, o);
  }

  put_updateCustomerTradeOfferPromotion(customerId, tradeOfferId, promoId, o) {
    return this.http.put(`${this.inventoryUrl}/customer/${customerId}/trade-offer/${tradeOfferId}/promotion/${promoId}`, o);
  }

  delete_deleteCustomerTradeOfferPromotion(customerId, tradeOfferId, promoId) {
    return this.http.delete(`${this.inventoryUrl}/customer/${customerId}/trade-offer/${tradeOfferId}/promotion/${promoId}`);
  }

  get_customerTradeOfferList(id) {
    return this.http.get(`${this.inventoryUrl}/customer/${id}/trade-offers`);
  }

  get_customerOrderList(id) {
    return this.http.get(`${this.inventoryUrl}/customer/${id}/orders`);
  }

  get_customerWatchList(id) {
    return this.http.get(`${this.inventoryUrl}/customer/${id}/watch-list`);
  }

  get_countryList() {
    return this.http.get(`${this.adminUrl}/countries`);
  }

  get_stateList(countryId) {
    return this.http.get(`${this.adminUrl}/country/${countryId}/states`);
  }
}
