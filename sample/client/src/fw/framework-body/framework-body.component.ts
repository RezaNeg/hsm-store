import { Component, OnInit } from '@angular/core';
import { fadeInAnimation, slideInOutAnimation } from '../animations/index.animation';
import { FrameworkConfigService } from '../services/framework-config.service';


@Component({
  selector: 'fw-framework-body',
  templateUrl: './framework-body.component.html',
  styleUrls: ['./framework-body.component.css'],
  animations: [ fadeInAnimation, slideInOutAnimation ],


})
export class FrameworkBodyComponent implements OnInit {

  constructor( private frameworkConfigService: FrameworkConfigService) { }

  ngOnInit() {
  }

}
