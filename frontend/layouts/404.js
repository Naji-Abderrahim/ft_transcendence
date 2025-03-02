
export class InvalidPath extends HTMLElement {

	constructor () {
		super();
	}

	connectedCallback() {
		const template = document.getElementById('invalid-path-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}

}

customElements.define('invalid-path-page', InvalidPath);