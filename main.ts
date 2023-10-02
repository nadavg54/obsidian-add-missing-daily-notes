import { Notice, Plugin, TFile, TFolder } from 'obsidian';
import { AddMissingPathSettingsTab } from 'settings';

// Remember to rename these classes and interfaces!

interface AddMissingNotesSettings {
  dailyNotesPath:any
}

const DEFAULT_SETTINGS: Partial<AddMissingNotesSettings> = {
  dailyNotesPath: {}
};

export default class AddMissingDailyNotes extends Plugin {
  settings: AddMissingNotesSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AddMissingPathSettingsTab(this.app, this));
    this.addRibbonIcon('book-open', 'add missing notes', () => {
      for(const [key,val] of Object.entries(this.settings.dailyNotesPath)) {
        this.addMissingNotes(val as string)
      }
    });
  }

  private async addMissingNotes(path: string) {
    const dailyNotesPath = path;
    const notesFolder = this.app.vault.getAbstractFileByPath(dailyNotesPath) as TFolder;
    const notesNames = await this.getNotesNames22(notesFolder.name);

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

  private async getNotesNames22(notesPath: string) {
    const notesFolder = await this.app.vault.adapter.list(notesPath);
    return notesFolder.files.filter(file => file.endsWith(".md"))
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
