import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface SkinAnalysisResult {
  success: boolean;
  analysisId?: number;
  status?: string;
  analysisResult?: {
    acneDetected: boolean;
    acneLevel: string;
    acneSeverityLevel: number;
    confidence: number;
  };
  recommendations?: any[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkinAnalysisService {
  private readonly apiUrl = 'https://flawless-backend-hugx.onrender.com/api/analysis/analyze';

  constructor(private http: HttpClient) {}

  analyzeImage(imageFile: File, survey: any, token: string): Observable<SkinAnalysisResult> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('survey', JSON.stringify(survey));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<SkinAnalysisResult>(this.apiUrl, formData, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Analysis error:', error);
        return throwError(() => error);
      })
    );
  }
}
