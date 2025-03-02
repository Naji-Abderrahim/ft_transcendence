export class Rule extends HTMLElement {

	constructor () {
		super();
	}

	async connectedCallback() {
		const template = document.getElementById('rule-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);

		const rule = await JSON.parse(this.dataset.ruleId);

		this.querySelector(".rule-icon").src = `${rule.icon}`;
		this.querySelector(".rule-info .title").textContent = rule.name;
		this.querySelector(".rule-info .description").textContent = rule.description;
	}

}

customElements.define('rule-component', Rule);