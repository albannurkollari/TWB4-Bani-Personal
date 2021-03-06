import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { DataService } from './services/data.service';
import { LocalizationService } from './services/localization.service';

// Constants
import * as CONSTANTS from './admin.links';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  links = CONSTANTS.LINKS;
  strings: Object = {};
  localLng = localStorage.localization !== undefined ? localStorage.localization : 'en-US';
  languages: Object[] = [];
  header: string;
  errors: any[] = [];

  initLocalization: Function = (): void => {
    // localStorage.removeItem('localization');
    this._localization.loadLng(this.localLng).subscribe(
      strings => {
        if (strings !== undefined && typeof strings === 'object' && Object.keys(strings).length > 0) {
          this.strings = strings;
          this._localization.storeLng(strings);

          if (this.strings.hasOwnProperty('languages')) {
            const _lngs = this.strings['languages'];
            let _languages: Object[] = [];

            for (const _lng in _lngs) {
              if (_lngs.hasOwnProperty(_lng)) {
                _languages.push({'label': _lng, 'value': _lngs[_lng]});
              }
            }

            this.languages = _languages;
          }

          // We load header title specific to the router-outlet inside admin page by subscribing to an observable shared on a service.
          this._localization.header.subscribe(
            header => {
              this.header = header;
            },
            error => this.errors.push(error)
          );

          const _adminPath = this._router.url.endsWith('admin');

          if (_adminPath) {
            this._router.navigateByUrl('/admin/dashboard');
          }
        }
      },
      error => this.errors.push(error)
    );
  }

  saveLocalization: Function = (value: string, childComp?: any): void => {
    if (value === undefined || typeof value !== 'string' || value.trim().length <= 0) {
      return;
    }

    localStorage.setItem('localization', value);
    console.log(localStorage.getItem('localization'));
    setTimeout(() => this.initLocalization(), 300);
  }

  ngOnInit() {
    // We load all strings of selected language in this block of code.
    this.initLocalization();
  }

  constructor(private _router: Router, private _localization: LocalizationService) { }
}
