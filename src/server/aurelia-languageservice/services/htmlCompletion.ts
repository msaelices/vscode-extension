import { TextDocument, Position, CompletionList, CompletionItemKind, Range } from 'vscode-languageserver-types';
import { HTMLDocument } from '../parser/htmlParser';
import { TokenType, createScanner, ScannerState } from '../parser/htmlScanner'
import { getAureliaTagProvider } from '../parser/aureliaTagProvider'

export interface IHTMLTagProvider {
	getId(): string;
	isApplicable(languageId: string);
	collectTags(collector: (tag: string, label: string) => void): void;
	collectAttributes(tag: string, collector: (attribute: string, type: string) => void): void;
	collectValues(tag: string, attribute: string, collector: (value: string) => void): void;
}

export function doComplete(document: TextDocument, position: Position, htmlDocument: HTMLDocument): CompletionList {

  let tagProvider = getAureliaTagProvider();
	let result: CompletionList = {
		isIncomplete: false,
		items: []
	};
  let offset = document.offsetAt(position);
	let node = htmlDocument.findNodeBefore(offset);
  let text = document.getText();
	
  let scanner = createScanner(text, node.start);
	
  let currentTag: string;
	let currentAttributeName: string;
  let token = scanner.scan();

  function getReplaceRange(replaceStart: number, replaceEnd: number = offset): Range {
		if (replaceStart > offset) {
			replaceStart = offset;
		}
		return { start: document.positionAt(replaceStart), end: document.positionAt(replaceEnd) };
	}

	function collectOpenTagSuggestions(afterOpenBracket: number, tagNameEnd?: number): CompletionList {
		let range = getReplaceRange(afterOpenBracket, tagNameEnd);
    tagProvider.collectTags((tag, label) => {
      result.items.push({
        label: tag,
        kind: CompletionItemKind.Property,
        documentation: label,
        textEdit: { newText: tag, range: range }
      });
		});
		return result;
	}

	function collectTagSuggestions(tagStart: number, tagEnd: number): CompletionList {
		collectOpenTagSuggestions(tagStart, tagEnd);
		return result;
	}

	function collectAttributeNameSuggestions(nameStart: number, nameEnd: number = offset): CompletionList {
		let range = getReplaceRange(nameStart, nameEnd);
		let value = isFollowedBy(text, nameEnd, ScannerState.AfterAttributeName, TokenType.DelimiterAssign) ? '' : '="{{}}"';
    tagProvider.collectAttributes(currentTag, (attribute, type) => {
      let codeSnippet = attribute;
      if (type !== 'v' && value.length) {
        codeSnippet = codeSnippet + value;
      }
      result.items.push({
        label: attribute,
        kind: type === 'handler' ? CompletionItemKind.Function : CompletionItemKind.Value,
        textEdit: { newText: codeSnippet, range: range }
      });
    });
		return result;
	}

	function collectAttributeValueSuggestions(valueStart: number, valueEnd?: number): CompletionList {
		let range: Range;
		let addQuotes: boolean;
		if (offset > valueStart && offset <= valueEnd && text[valueStart] === '"') {
			// inside attribute
			if (valueEnd > offset && text[valueEnd-1] === '"') {
				valueEnd--;
			}
			let wsBefore = getWordStart(text, offset, valueStart + 1);
			let wsAfter = getWordEnd(text, offset, valueEnd); 
			range = getReplaceRange(wsBefore, wsAfter);
			addQuotes = false
		} else {
			range = getReplaceRange(valueStart, valueEnd);
			addQuotes = true;
		}

    tagProvider.collectValues(currentTag, currentAttributeName, (value) => {
      let codeSnippet = addQuotes ? '"' + value + '"' : value;
      result.items.push({
        label: value,
        filterText: codeSnippet,
        kind: CompletionItemKind.Unit,
        textEdit: { newText: codeSnippet, range: range }
      });
    });
		return result;
	}

	function scanNextForEndPos(nextToken: TokenType) : number {
		if (offset === scanner.getTokenEnd()) {
			token = scanner.scan();
			if (token === nextToken && scanner.getTokenOffset() === offset) {
				return scanner.getTokenEnd();
			}
		}
		return offset;
	}


  while (token !== TokenType.EOS && scanner.getTokenOffset() <= offset) {
		switch (token) {
			case TokenType.StartTagOpen:
				if (scanner.getTokenEnd() === offset) {
					let endPos = scanNextForEndPos(TokenType.StartTag);
					return collectTagSuggestions(offset, endPos);
				}
				break;
			case TokenType.StartTag:
				if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
					return collectOpenTagSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
				}
				currentTag = scanner.getTokenText();
				break;
			case TokenType.AttributeName:
				if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
					return collectAttributeNameSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
				}
				currentAttributeName = scanner.getTokenText();
				break;
			case TokenType.DelimiterAssign:
				if (scanner.getTokenEnd() === offset) {
					return collectAttributeValueSuggestions(scanner.getTokenEnd());
				}
				break;
			case TokenType.AttributeValue:
				if (scanner.getTokenOffset() <= offset && offset <= scanner.getTokenEnd()) {
					return collectAttributeValueSuggestions(scanner.getTokenOffset(), scanner.getTokenEnd());
				}
				break;
			case TokenType.Whitespace:
				if (offset <= scanner.getTokenEnd()) {
					switch (scanner.getScannerState()) {
						case ScannerState.AfterOpeningStartTag:
							let startPos = scanner.getTokenOffset();
							let endTagPos = scanNextForEndPos(TokenType.StartTag);
							return collectTagSuggestions(startPos, endTagPos);
						case ScannerState.WithinTag:
						case ScannerState.AfterAttributeName:
							return collectAttributeNameSuggestions(scanner.getTokenEnd());
						case ScannerState.BeforeAttributeValue:
							return collectAttributeValueSuggestions(scanner.getTokenEnd());
					}
				}
				break;
		}
		token = scanner.scan();
	}

	return result;
}

function isWhiteSpace(s: string): boolean {
	return /^\s*$/.test(s);
}

function isWhiteSpaceOrQuote(s: string): boolean {
	return /^[\s"]*$/.test(s);
}

function isFollowedBy(s: string, offset:number, intialState: ScannerState, expectedToken: TokenType) {
	let scanner = createScanner(s, offset, intialState);
	let token = scanner.scan();
	while (token === TokenType.Whitespace) {
		token = scanner.scan();
	}
	return token == expectedToken;
}

function getWordStart(s: string, offset: number, limit: number): number {
	while (offset > limit && !isWhiteSpace(s[offset-1])) {
		offset--;
	}
	return offset;
}

function getWordEnd(s: string, offset: number, limit: number): number {
	while (offset < limit && !isWhiteSpace(s[offset])) {
		offset++;
	}
	return offset;
}
