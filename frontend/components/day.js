export class Day extends HTMLElement {

	constructor () {
		super();
	}

	connectedCallback() {
		const template = document.getElementById('day-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}

}

customElements.define('day-component', Day);