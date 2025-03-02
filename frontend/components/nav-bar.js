export class NavBar extends HTMLElement {

	constructor () {
		super();
	}

	connectedCallback() {
		const template = document.getElementById('nav-bar-template');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
		this.render();
	}

	render() {
		if (app.router.previousPath !== null) {
			this.querySelector('.prev-page').closest('a').setAttribute('href', app.router.previousPath);
			this.querySelector('.prev-page').textContent = app.router.previousPath.slice(1,2).toUpperCase() + app.router.previousPath.slice(2);
			this.querySelector('.back-button').classList.add('show-back-button');
		}
		else {
			this.querySelector('.back-button').classList.remove('show-back-button');
		}
		this.querySelector('.user-image').src = app.user.image;
		this.querySelector('.welcome-message').textContent = `Hi, ${app.user.first_name} ${app.user.last_name}!`;
		
		this.setTwoFactorMessage();
		window.addEventListener('apptwofactorstatechanged', () => {
			this.setTwoFactorMessage();
		});
		this.setupDropdown();
	}

	setTwoFactorMessage() {
		const tfaMessage = this.querySelector('.two-factor-text');
		(app.user.twoFA === true) ?
			(tfaMessage.textContent = "Disable 2FA" , tfaMessage.closest('a').setAttribute('href', '/disable-2fa'))
			: (tfaMessage.textContent = "Enable 2FA" , tfaMessage.closest('a').setAttribute('href', '/enable-2fa'));
	}

	setupDropdown() {
		const dropdownMenu = this.querySelector('.dropdown-menu');
		const dropdownToggle = this.querySelector('.dropdown-toggle');
		const dropdownItems = this.querySelectorAll('.dropdown-item');

		dropdownToggle.addEventListener('click', () => {
			if (dropdownToggle.src.search("/assets/icons/arrow-down.svg") > 0) {
				dropdownToggle.src = "/assets/icons/arrow-up.svg";
				dropdownMenu.classList.add('show-dropdown-menu');
			} else {
				dropdownToggle.src = "/assets/icons/arrow-down.svg";
				dropdownMenu.classList.remove('show-dropdown-menu');
			}
		});

		dropdownItems.forEach(item => {
			item.addEventListener('click', () => {
				dropdownToggle.src = "/assets/icons/arrow-down.svg";
				dropdownMenu.classList.remove('show-dropdown-menu');
			});
		});

		document.addEventListener('click', (event) => {
            const path = event.composedPath();
            if (!path.some(element => 
                element.classList && (
					element.classList.contains('dropdown') ||
					element.classList.contains('dropdown-menu')
                )
            )) {
                dropdownToggle.src = "/assets/icons/arrow-down.svg";
                dropdownMenu.classList.remove('show-dropdown-menu');
            }
        });
	}

}

customElements.define('nav-bar-component', NavBar);