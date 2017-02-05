import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class CaptionElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <caption> element represents the title of a table. Though it is always the first descendant of a <table>, its styling, using CSS, may place it elsewhere, relative to the table.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.events = GlobalAttributes.events;
  }
}