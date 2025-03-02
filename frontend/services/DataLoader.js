const DataLoader = {
	members: null,
	games: null,
	userData : null,
	twoFa : null,

	memberUrl: "data/members.json",
	gameUrl: "data/games.json",
	userUrl: "/api/user/data",
	twoFaUrl: "/api/user/enable2FA",
	checkUserUrl: "/api/auth/check_user",
	
    fetchMembers: async () => {
        const result = await fetch(DataLoader.memberUrl);
        DataLoader.members =  await result.json();
    },

    fetchGames: async () => {
        const result = await fetch(DataLoader.gameUrl);
        DataLoader.games =  await result.json();
    },

	fetchTwoFaCredentials: async () => {
        try {
			const response =  await fetch(DataLoader.twoFaUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					"content-type": "application/json",
				}
			});
			
			if (response.status === 401) {
				app.router.go('/');
				return;
			}

			if (response.status === 500) {
				app.router.go('/501-server-error');
				return;
			}
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			DataLoader.twoFa = await response.json();
		} catch (error) {
			console.error('Enable2FA error:', error);
		}
    },

    fetchUser: async () => {
		try {
			const response =  await fetch(DataLoader.userUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					"content-type": "application/json",
				}
			});
			
			if (response.status === 401) {
				app.router.go('/');
				return;
			}

			if (response.status === 500) {
				app.router.go('/501-server-error');
				return;
			}
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			DataLoader.userData = await response.json();
            app.user.constructor(DataLoader.userData);
			
		} catch (error) {
			console.error('Login error:', error);
			app.router.go('/');
		}
    },

    checkUser: async () => {
		try {
			const response = await fetch(DataLoader.checkUserUrl, {
				method: 'HEAD',
				credentials: 'include',
				headers: {
					"content-type": "application/json",
				}
			});
			
			if (response.status === 401) {
				return false;
			}

			if (response.status === 500) {
				app.router.go('/501-server-error');
				return false;
			}
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			return true;

		} catch (error) {
			console.error('Check User error:', error);
			return false;
		}
    }
}

export default DataLoader;