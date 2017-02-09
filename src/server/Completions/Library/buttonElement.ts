import { Attribute, Value, Event, GlobalAttributes } from './_elementStructure';

export default class ButtonElement {

  public url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button';
  public licenceText = `MDN by Mozilla Contributors (${this.url}$history) is licensed under CC-BY-SA 2.5.`;

  public documentation = `The HTML <button> element represents a clickable button.`;

  public attributes: Map<string, Attribute>;
  public events: Map<string, Event>;

  constructor() {
    this.attributes = GlobalAttributes.attributes;
    this.attributes.set('autofocus',
      new Attribute(`This Boolean attribute lets you specify that the button should have input focus when the page loads, unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document can have this attribute specified.`));
    this.attributes.set('disabled',
      new Attribute(`This Boolean attribute indicates that the user cannot interact with the button. If this attribute is not specified, the button inherits its setting from the containing element, for example <fieldset>; if there is no containing element with the disabled attribute set, then the button is enabled.`));
    this.attributes.set('form',
      new Attribute(`The form element that the button is associated with (its form owner). The value of the attribute must be the id attribute of a <form> element in the same document. If this attribute is not specified, the <button> element will be associated to an ancestor <form> element, if one exists. This attribute enables you to associate <button> elements to <form> elements anywhere within a document, not just as descendants of <form> elements.`));
    this.attributes.set('formaction',
      new Attribute(`The URI of a program that processes the information submitted by the button. If specified, it overrides the action attribute of the button's form owner.`));
    this.attributes.set('formenctype',
      new Attribute(`If the button is a submit button, this attribute specifies the type of content that is used to submit the form to the server.`,
      null,
      null,
      null,
      null,
      new Map([
          ['application/x-www-form-urlencoded', new Value(`The default value if the attribute is not specified.`)],
          ['multipart/form-data', new Value(`Use this value if you are using an <input> element with the type attribute set to file.`)],
          ['text/plain', new Value(null)]
      ])));
    this.attributes.set('formmethod',
      new Attribute(`If the button is a submit button, this attribute specifies the HTTP method that the browser uses to submit the form.`,
      null,
      null,
      null,
      null,
      new Map([
          ['post', new Value('The data from the form is included in the body of the form and is sent to the server.')],
          ['get', new Value(`The data from the form are appended to the form attribute URI, with a '?' as a separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.`)]
      ])));
    this.attributes.set('formnovalidate',
      new Attribute(`If the button is a submit button, this Boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.`));                  
    this.attributes.set('formtarget',
      new Attribute(`If the button is a submit button, this attribute is a name or keyword indicating where to display the response that is received after submitting the form. This is a name of, or keyword for, a browsing context (for example, tab, window, or inline frame). If this attribute is specified, it overrides the target attribute of the button's form owner`,
      null,
      null,
      null,
      null,
      new Map([
          ['_self', new Value('Load the response into the same browsing context as the current one. This value is the default if the attribute is not specified.')],
          ['_blank', new Value('Load the response into a new unnamed browsing context.')],
          ['_parent', new Value(' Load the response into the parent browsing context of the current one. If there is no parent, this option behaves the same way as _self.')],
          ['_top', new Value('Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as _self.')]
      ]))); 
    this.attributes.set('name',
      new Attribute(`The name of the button, which is submitted with the form data.`)); 
    this.attributes.set('type',
      new Attribute(`The type of the button`,
      null,
      null,
      null,
      null,
      new Map([
          ['submit', new Value('The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.')],
          ['reset', new Value('The button resets all the controls to their initial values.')],
          ['button', new Value(`'The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur.`)],
          ['menu', new Value('The button opens a popup menu defined via its designated <menu> element.')]
      ]))); 
    this.attributes.set('value',
      new Attribute(`The initial value of the button. It defines the value associated with the button which is submitted with the form data.  This value is passed to the server in params when the form is submitted.`));          

    this.events = GlobalAttributes.events;
  }
}