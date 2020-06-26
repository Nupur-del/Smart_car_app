import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  options: any;
  constructor() { 
    console.log('popover construct');
  }

  ngOnInit() {
    console.log('data = ', this.options);
  }

}
