import { Notice, Plugin, TFile, TFolder } from 'obsidian';
import { AddMissingPathSettingsTab } from 'settings';

// Remember to rename these classes and interfaces!

interface AddMissingNotesSettings {
  dailyNotesPath: string;
}

const DEFAULT_SETTINGS: Partial<AddMissingNotesSettings> = {
  dailyNotesPath: 'DailyNotes',
};

export default class AddMissingDailyNotes extends Plugin {
  settings: AddMissingNotesSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AddMissingPathSettingsTab(this.app, this));
    this.addRibbonIcon('book-open', 'add missing notes', () => {
      this.addMissingNotes();
    });
  }

  private addMissingNotes() {
    const dailyNotesPath = this.settings.dailyNotesPath;
    const notesFolder = this.app.vault.getAbstractFileByPath(dailyNotesPath) as TFolder;
    const notesNames = this.getNotesNames(notesFolder.name);
    const dateIterator = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getMonth() - 1);
    for (let i = 0; i < 30; i++) {
      const dateStr = dateIterator.toISOString().split('T')[0];
      if (!notesNames.includes(dateStr + ".md")) {
        this.app.vault.create(dailyNotesPath + "/" + dateStr + ".md", "");
      }
      dateIterator.setDate(dateIterator.getDate() - 1);
    }
  }

  private getNotesNames(notesPath: string) {
    const notesFolder = this.app.vault.getAbstractFileByPath(notesPath) as TFolder;
    return notesFolder.children
    .filter(file => file instanceof TFile)
    .map(file => file.name);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
