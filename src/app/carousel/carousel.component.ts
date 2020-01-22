import { Component, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { timer, fromEvent, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild('tInput', { static: true }) tInputRef: ElementRef;
  @ViewChild('tStop', { static: true }) tStopRef: ElementRef;

  subscription: Subscription;
  needsNumber = false;
  cusPeriod = '3000';
  baseDir = 'assets/';
  imgSrc = '';

  imgArray = [
    '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'
  ];

  imgIndex = 0;
  timerCount = 0;

  constructor() { }

  ngOnInit(): void {
    this.setTimer(this.cusPeriod);

    const inputTxt: HTMLInputElement = this.tInputRef.nativeElement;
    inputTxt.value = this.cusPeriod;

    fromEvent(inputTxt, 'keyup').subscribe((e: KeyboardEvent) => {
      this.cusPeriod = inputTxt.value;
    });
  }

  setTimer(period: string, wait = 0) {
    const stopBtn = this.tStopRef.nativeElement;
    this.subscription = timer(wait, Number.parseInt(period, 10))
      .pipe(takeUntil(fromEvent(stopBtn, 'click')))
      .subscribe(x => {
        this.setImgSrc(this.timerCount += 1);
      });
  }

  setImgSrc(num: number) {
    this.imgIndex = num % this.imgArray.length;
    this.imgSrc = this.baseDir + this.imgArray[this.imgIndex];
  }

  onSetupBtnClick() {
    /^[0-9]+$/.test(this.cusPeriod) ? this.needsNumber = false : this.needsNumber = true;

    if (!this.needsNumber) {
      this.subscription.unsubscribe();
      this.setTimer(this.cusPeriod);
    }
  }

  onManualClick(direct: string) {
    this.subscription.unsubscribe();
    if (direct.toUpperCase() === 'LEFT') {
      this.setImgSrc(this.timerCount -= 1);
    } else {
      this.setImgSrc(this.timerCount += 1);
    }

    this.setTimer(this.cusPeriod, Number.parseInt(this.cusPeriod, 10) * 0.8);
  }
}
