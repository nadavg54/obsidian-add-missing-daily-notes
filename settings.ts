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

    new Setting(containerEl)
      .setName('Daily Notes Path')
      .setDesc('Daily Notes Path')
      .addText((text) =>
        text
          .setPlaceholder('Daily Notes Path')
          .setValue(this.plugin.settings.dailyNotesPath)
          .onChange(async (value) => {
            this.plugin.settings.dailyNotesPath = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
