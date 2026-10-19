import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {

  // Exercise 1: Add a new wizard
  addWizard(data: NewWizard): Wizard {
    const allWizards = this.getAll();

    const newId = allWizards.length > 0
      ? Math.max(...allWizards.map(wizard => wizard.id)) + 1
      : 1;

    const wizard: Wizard = {
      ...data,
      id: newId
    };

    this.add(wizard);

    return wizard;
  }

  // Exercise 2: Find wizards by house
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(
      wizard => wizard.house === house
    );
  }
}

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
