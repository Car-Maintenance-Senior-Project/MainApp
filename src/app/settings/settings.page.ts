import { Component, OnInit } from '@angular/core';
import { Device } from '../interfaces/device-struct';

import { DarkThemeSwitcherService } from '../services/dark-theme-switcher.service';
import { OBDConnectorService } from '../services/obd-connector.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public darkModeChecked: boolean;
  public bluetoothConnected: boolean = false;
  public bluetoothChipColor: string = this.bluetoothConnected ? "success" : "danger";
  private devices: Device[];
  private chosenMac: string;

  constructor(private darkThemeSwitcher: DarkThemeSwitcherService, 
              private OBD: OBDConnectorService) { }

  /**
   * on init - checks dark mode, bluetooth status, and get device list
   */
  ngOnInit() {
    this.darkModeChecked = this.darkThemeSwitcher.enabled;
    this.OBD.getPaired().then(resolve => {
      this.devices = this.OBD.getDeviceList();
    });
    this.OBD.isConnected().then(resolve => {
      this.bluetoothConnected = resolve;
    });
  }

  /**
   * Runs everytime a user choses a new mac to connect to.
   * Tries to connect to that mac.
   */
  onChangeOfMac() {
    this.OBD.Connect(this.chosenMac).then(sucsess => {
      this.OBD.isConnected().then(resolve => {
        this.bluetoothConnected = resolve;
      });
    }, failure => {
      // console.log('Couldnt connect to selected device');
    });
  }

  toggleDarkTheme(): void {
    this.darkThemeSwitcher.enableDarkTheme(this.darkModeChecked);
  }

}
