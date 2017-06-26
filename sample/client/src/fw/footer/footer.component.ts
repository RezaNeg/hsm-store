import { Component, OnInit } from '@angular/core';
import { FrameworkConfigService } from '../services/framework-config.service';
@Component({
  selector: 'fw-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
      private frameworkConfigService : FrameworkConfigService
  ) { }

  ngOnInit() {
  }

}
