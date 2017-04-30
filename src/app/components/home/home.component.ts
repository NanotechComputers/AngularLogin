import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  public showSidebar: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  public sidebarToggle(){
    this.showSidebar = !this.showSidebar;
  }
}
