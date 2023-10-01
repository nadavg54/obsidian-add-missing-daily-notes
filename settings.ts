import ExamplePlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class AddMissingPathSettingsTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    this.createPathSettings(containerEl,"HiBob") 
    this.createPathSettings(containerEl,"Nadav") 
  }

  createPathSettings(containerEl:HTMLElement, name:string): void {
    let dailyNotesPath = this.plugin.settings.dailyNotesPath
    let pathVal: string
    if(dailyNotesPath != null){
      pathVal = dailyNotesPath[name]
    }
    else {
      pathVal = ""
    }
    new Setting(containerEl)
      .setName(`${name} Daily Notes Path`)
      .setDesc(`${name} Daily Notes Path`)
      .addText((text) =>
        text
          .setPlaceholder('Daily Notes Path')
          .setValue(pathVal as string)
          .onChange(async (value) => {
            dailyNotesPath[name] = value
            await this.plugin.saveSettings();
          })
      );
  }
}
