const Router = {
	previousPath : null,
	allowed_paths : ["/", "/home", "/profile"],

	init :  () => {
		if (Router.allowed_paths.includes(location.pathname)) {
			Router.go(location.pathname);
		} else {
			Router.go('404-not-found', false);
		}
	},

	init_links : (shadow) => {
		shadow.querySelectorAll("a.link").forEach(element => {
			element.addEventListener('click', async (event) => {
				event.preventDefault();
				const link = event.target.closest('a');
				const path = link.getAttribute("href");
				Router.go(path);
			})
			window.addEventListener("popstate", event => {
				Router.go(event.state.path, false);
			})
		})
	},

	go : async (path, addToHistory = true) => {
		if (addToHistory && Router.allowed_paths.includes(path)) { 
			history.pushState({path}, '', path); 
		}

		let pageElement = null;
		try {
			if (Router.allowed_paths.includes(path) && path !== '/')
			{
				const isAuthenticated = await app.dataLoader.checkUser();
				if (!isAuthenticated) {
					Router.go('/');
					return;
				}
				if (app.dataLoader.userData === null) {
					await app.dataLoader.fetchUser();
				}
				if (!app.user.is_twofa_validated) {
						app.router.go('/auth');
						return;
				}
			}

			switch (path) {
				case "/" :
					pageElement = document.createElement("landing-page");
					break;
				
				// Home page
				case "/home":
					Router.previousPath = null;
					pageElement = document.createElement("home-page");
					break;

				// Profile page 
				case "/profile" :
					Router.previousPath = '/home';
					pageElement = document.createElement("profile-page");
					break;
					
				//Auth page	
				case "/auth" :
					pageElement = document.createElement("auth-page");
					break;
				
				//enable 2fa	
				case "/enable-2fa" :
					window.dispatchEvent(new Event('apptwofactortriggered'));
					break;

				//disable 2fa
				case "/disable-2fa" :
					try {
						const response = await fetch('/api/user/disable2FA', {
							method: 'GET',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							}
						});

						if (response.status === 401) {
							Router.go('/');
							return;
						}
						
						if (response.status === 500) {
							Router.go('/501-server-error');
							return;
						}

						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}

						//update userProxy
						app.user.twoFA = false;
						console.log('2FA disabled');
						window.dispatchEvent(new Event('apptwofactorsectionremove'));
						
					} catch (error) {
						console.error('Disable-2fa error:', error);
						window.dispatchEvent(new Event('apptwofactorsectionremove'));
					}
					break;
				
				// log out
				case "/log-out" :
					try {
						const response = await fetch('/api/user/logout', {
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json'
						}
						});
						
						if (response.status === 401) {
							Router.go('/');
							return;
						}

						if (response.status === 500) {
							Router.go('/501-server-error');
						}
						
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						Router.go('/');
					} catch (error) {
						console.error('Logout error:', error);
						Router.go('/');
					}
					break;
				
				// 404 page
				default :
					pageElement = document.createElement("invalid-path-page");
					break;
			}
			
			if (pageElement) {
				const main = document.querySelector('.main-view');
				main.innerHTML = "";
				main.appendChild(pageElement);
			}

			window.scrollX = 0;
		} catch (error) {
			console.error('Navigation error:', error);
			Router.go('/');
		}
	}
}

export default Router;