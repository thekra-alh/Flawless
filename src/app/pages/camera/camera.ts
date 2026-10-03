import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-camera',
  imports: [RouterLink, CommonModule],
  templateUrl: './camera.html',
  styleUrl: './camera.css'
})
export class CameraComponent implements OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  streaming = false;
  error = '';
  private stream: MediaStream | null = null;

  constructor(private data: SkinDataService, private router: Router) {}

  async start() {
    this.error = '';
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      this.streaming = true;
      setTimeout(() => {
        this.video.nativeElement.srcObject = this.stream;
        this.video.nativeElement.play();
      });
    } catch {
      this.error = 'Camera access denied. Please allow permission and try again.';
    }
  }

  capture() {
    const v = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d')!.drawImage(v, 0, 0);
    this.data.savePhoto(canvas.toDataURL('image/jpeg'));
    this.data.saveScan();
    this.stop();
    this.router.navigate(['/results']);
  }

  stop() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.streaming = false;
  }

  ngOnDestroy() {
    this.stop();
  }
}