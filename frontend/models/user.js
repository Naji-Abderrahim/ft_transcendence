const User = {
	constructor(userData) {
        this.login = userData?.login || null;
        this.first_name = userData?.first_name || null;
        this.last_name = userData?.last_name || null;
        this.email = userData?.email || null;
        this.image = userData?.image || null;
        this.twoFA = userData?.twoFA || false;
        this.is_twofa_validated = userData?.is_twofa_validated || false;
    }
}


const proxiedUser = new Proxy(User, {

	set(target, property, value) {
        target[property]=value;

		if (property=="twoFA") {
            window.dispatchEvent(new Event("apptwofactorstatechanged"));
        }
        return true;
    },
    get(target, property) {
        return target[property]
    }
  }    
)

export default proxiedUser;
