import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MediaService {

  private apiUploadUrl = 'https://164.90.180.143:8443/media/upload';
  private apiGetMediaUrl = 'https://164.90.180.143:8443/media/product/';
  private apiUploadAvatarUrl = 'https://164.90.180.143:8443/api/users';
  private apiGetAvatarUrl = 'https://164.90.180.143:8443/api/users';

  constructor(private http: HttpClient) { }

  // Upload media
  uploadMedia(media: File, productId: string, token: string) {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('file', media);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // No need to set the Content-Type header, HttpClient will set it automatically
    return this.http.post(this.apiUploadUrl, formData, { headers: headers, responseType: 'text' });
  }

  //get media
  getMedia(productId: string) {
    return this.http.get(this.apiGetMediaUrl + productId);
  }

  //upload avatar
  uploadAvatar(avatar: File, userId: string, token: string) {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // No need to set the Content-Type header, HttpClient will set it automatically
    return this.http.post(`${this.apiUploadAvatarUrl}/${userId}` + '/avatar', formData, { headers: headers, responseType: 'text' });
  }

  //get avatar
  getAvatar(userId: string, token: string) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiGetAvatarUrl}/${userId}` + '/avatar', { headers: headers, responseType: 'text' });
  }


  getMediaByProductId(productId: string, token: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiGetMediaUrl + productId, { headers: headers })
      .pipe(
        map(response => Array.isArray(response) ? response.map(item => item.imagePath) : [])
      );
  }


  deleteMedia(productId: string, token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(this.apiGetMediaUrl + productId, { headers: headers, responseType: 'text' });
  }
}

