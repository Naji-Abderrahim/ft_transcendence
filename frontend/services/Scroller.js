const Scroller = {
   init : () => {
        const LandingPage = document.querySelector('landing-page');
        if (!LandingPage || !LandingPage.shadowRoot) return;

        const sections = LandingPage.shadowRoot.querySelectorAll('section');
        const mainView = LandingPage.shadowRoot.querySelector('.home-main-view');
        
        
        mainView.scrollTop = 0;

        const observerOptions = {
            root: mainView,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            const visibleSection = entries.find(entry => entry.isIntersecting);
            
            if (visibleSection) {
                const sectionId = visibleSection.target.id;
                Scroller.setActiveNavlink(`${sectionId}-link`, LandingPage.shadowRoot);
                Scroller.setActiveScrollbar(sectionId, LandingPage.shadowRoot);
                setTimeout(() => {
                    Scroller.setInactiveScrollbar(LandingPage.shadowRoot);
                }, 900);
            }
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));

        const navLinks = LandingPage.shadowRoot.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                Scroller.setActiveNavlink(e.target.id, LandingPage.shadowRoot);
                const targetId = e.target.textContent.toLowerCase();
                Scroller.scrollTo(targetId, LandingPage.shadowRoot);
                Scroller.setActiveScrollbar(targetId, LandingPage.shadowRoot);
                setTimeout(() => {
                    Scroller.setInactiveScrollbar(LandingPage.shadowRoot);
                }, 900);
            });
        });
   },

   scrollTo : (id, shadowRoot) => {
        const section = shadowRoot.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
   },

   setActiveScrollbar : (targetId, shadowRoot) => {
        const thumb = shadowRoot.querySelector('.scrollbar-thumb');
        const scrollbar = shadowRoot.querySelector('.scrollbar');

        scrollbar.classList.add('scrollbar-active');
        thumb.classList.remove('scrollbar-thumb-home', 'scrollbar-thumb-games', 'scrollbar-thumb-team');
        thumb.classList.add('scrollbar-thumb-' + targetId);
   },

   setInactiveScrollbar : (shadowRoot) => {
        const scrollbar = shadowRoot.querySelector('.scrollbar');
        scrollbar.classList.remove('scrollbar-active');
   },

   setActiveNavlink : (targetId, shadowRoot) => {
        const navLinks = shadowRoot.querySelectorAll('.nav-link');
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = shadowRoot.getElementById(targetId);
        activeLink.classList.add('active');
}
}

export default Scroller;