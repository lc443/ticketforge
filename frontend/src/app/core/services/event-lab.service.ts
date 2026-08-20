import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventLabService {
  private readonly http = inject(HttpClient);

  loadEvent(eventId: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`http://localhost:8080/api/events/${eventId}`, { headers });
  }
}
