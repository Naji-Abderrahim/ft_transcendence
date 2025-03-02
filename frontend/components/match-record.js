export class MatchRecord extends HTMLElement {

	constructor () {
		super();
	}

	connectedCallback() {
		const template = document.getElementById('match-record-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}

}

customElements.define('match-record-component', MatchRecord);