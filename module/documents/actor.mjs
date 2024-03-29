/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class SsSsActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.ssss || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
    if(typeof data.health !== "undefined"){
      data.health.max = (data.health.max == null || data.health.max == 0) ? 
        this.npcMaxHealthCalculation(data) : data.health.max;
      data.health.value = (data.health.value == null || data.health.value == -1) ?
        data.health.max : data.health.value;
    }
    data.damage = data.damage == "" ? this.npcDamageCalculation(data) : data.damage;
  }
  
  npcMaxHealthCalculation(data){
    let maxHealth = 0;
    for (let i = 0; i < data.dd; i++) {
      maxHealth += (Math.floor(Math.random()*(6)+1));
      }
    return maxHealth;
  }

  npcDamageCalculation(data){
    switch (data.dd) {
      case 1:
        return "d6-1";
      case 2:
        return "d6";
      case 3:
        return "d6+1";
      case 4:
        return "d6+2";
      case 5:
        return "2d6";
      case 6:
        return "2d6+1";
      case 7:
        return "2d6+2";
      default:
        return "3d6+"+(data.dd-8);

    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

}