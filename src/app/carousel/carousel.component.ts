import { Component, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { timer, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild('tInput', { static: true }) tInputRef: ElementRef;
  @ViewChild('tSetup', { static: true }) tSetupRef: ElementRef;
  @ViewChild('tStop', { static: true }) tStopRef: ElementRef;

  subscription: Subscription;
  needsNumber = false;
  cusPeriod = '3000';
  baseDir = 'assets/';
  imgSrc = '';

  imgArray = [
    '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'
  ];

  constructor() { }

  ngOnInit(): void {
    this.setTimer(this.cusPeriod);

    const inputTxt: HTMLInputElement = this.tInputRef.nativeElement;
    const setupBtn: HTMLButtonElement = this.tSetupRef.nativeElement;
    const stopBtn: HTMLButtonElement = this.tStopRef.nativeElement;

    fromEvent(inputTxt, 'keyup').subscribe((e: KeyboardEvent) => {
      this.cusPeriod = inputTxt.value;
    });

    fromEvent(setupBtn, 'click').subscribe((e: MouseEvent) => {
      /^[0-9]+$/.test(this.cusPeriod) ? this.needsNumber = false : this.needsNumber = true;

      if (!this.needsNumber) {
        this.subscription.unsubscribe();
        this.setTimer(this.cusPeriod);
      }
    });

    fromEvent(stopBtn, 'click').subscribe((e: MouseEvent) => {
      this.subscription.unsubscribe();
    });
  }

  setTimer(period: string) {
    this.subscription = timer(0, Number.parseInt(period, 10)).subscribe(x => this.setImgSrc(x));
  }

  setImgSrc(num: number) {
    this.imgSrc = this.baseDir + this.imgArray[num % this.imgArray.length];
  }
}
