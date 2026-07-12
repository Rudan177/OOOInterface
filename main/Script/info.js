class InfoManager {
    constructor(app) {
        this.app = app;
        this.infoContainer = null;
        this.infoIndicator = null;
        this._infoIframeClosed = false;
        this._infoIframeHasContent = false;
        this._infoIframeLoadTimeout = null;
        this._infoHoverInitialized = false;
        this._closeBtnInitialized = false;
    }

    init() {
        this.infoContainer = document.getElementById('infoContainer');
        this.infoIndicator = document.getElementById('info-indicator');
        
        if (this.infoContainer) {
            this.setupInfoContainer();
        }
    }

    setupInfoContainer() {
        if (this._closeBtnInitialized) return;
        this._closeBtnInitialized = true;

        const closeBtn = this.infoContainer.querySelector('.info-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideInfoContainer();
            });
        }

        const scrollableContent = this.infoContainer.querySelector('.scrollable-content');
        if (scrollableContent) {
            scrollableContent.addEventListener('wheel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollableContent.scrollLeft += e.deltaY || e.deltaX;
            });
        }

        this.infoContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
    }

    async applyHideInfoPopup() {
        if (!this.infoContainer || !this.infoIndicator) return;

        if (this.app.isHideInfoPopupActive()) {
            this.infoContainer.style.display = 'none';
            this.infoContainer.style.opacity = '0';
            this.infoContainer.style.pointerEvents = 'none';
            if (this.infoIndicator) this.infoIndicator.classList.remove('visible');
            return;
        }

        this._infoIframeClosed = false;
        this._infoIframeHasContent = false;

        this.infoContainer.style.opacity = '';
        this.infoContainer.style.pointerEvents = '';
        
        await this.loadInfoContent();

        if (this.infoIndicator) {
            this.infoIndicator.classList.remove('visible');
        }
        this.infoContainer.classList.add('has-content');

        this.initInfoPopupHover();

        clearTimeout(this._infoIframeLoadTimeout);
        this._infoIframeLoadTimeout = setTimeout(() => {
            if (!this._infoIframeClosed && !this._infoIframeHasContent) {
                if (this.infoIndicator) {
                    this.infoIndicator.classList.add('visible');
                }
                this.updateInfoIndicatorColor();
            }
        }, 1500);
    }

    async loadInfoContent() {
        const remoteUrl = 'https://rudan177.github.io/OOOInterface/info/info-interface-5.2.json';
        
        try {
            const response = await fetch(remoteUrl + '?t=' + Date.now());
            if (!response.ok) {
                this.hideInfoContainer();
                return;
            }
            
            const config = await response.json();
            const titleEmpty = !config.title || config.title.trim() === '';
            const linkEmpty = !config.link || config.link.trim() === '';
            const textEmpty = !config.text || config.text.trim() === '';
            
            if (titleEmpty && linkEmpty && textEmpty) {
                this.hideInfoContainer();
                return;
            }
            
            const h1Element = this.infoContainer.querySelector('h1');
            const spanElement = this.infoContainer.querySelector('p span');
            const dividers = this.infoContainer.querySelectorAll('.info-divider');
            
            if (h1Element && config.title) {
                h1Element.textContent = config.title;
                h1Element.style.display = '';
            } else if (h1Element) {
                h1Element.style.display = 'none';
            }
            
            if (spanElement && config.text) {
                if (config.link) {
                    spanElement.innerHTML = `<a href="${config.link}" target="_blank">${config.text}</a>`;
                } else {
                    spanElement.textContent = config.text;
                }
                this.infoContainer.querySelector('.scrollable-content').style.display = '';
            } else if (spanElement) {
                spanElement.textContent = '';
                this.infoContainer.querySelector('.scrollable-content').style.display = 'none';
            }
            
            if (dividers[0]) {
                dividers[0].style.display = (!titleEmpty && !textEmpty) ? '' : 'none';
            }
            if (dividers[1]) {
                dividers[1].style.display = !textEmpty ? '' : 'none';
            }
            
        } catch (e) {
            this.hideInfoContainer();
        }
    }

    showInfoContainer() {
        if (!this.infoContainer) return;
        this.infoContainer.classList.add('show');
    }

    hideInfoContainer() {
        if (!this.infoContainer) return;
        this.infoContainer.classList.remove('show');
        this._infoIframeClosed = true;
        this._infoIframeHasContent = true;
    }

    updateInfoIndicatorColor() {
        if (!this.infoIndicator) return;

        const isVisible = this.infoIndicator.classList.contains('visible');
        this.infoIndicator.className = 'info-indicator';
        if (isVisible) this.infoIndicator.classList.add('visible');

        const colorScheme = this.app.settings.colorScheme || 'green';
        const colorClass = getColorConfig(colorScheme).infoClass;
        
        this.infoIndicator.classList.add(colorClass);
    }

    refreshInfoIndicator() {
        if (!this.infoContainer || !this.infoIndicator) return;

        if (this.app.isHideInfoPopupActive()) {
            this.infoIndicator.classList.remove('visible');
            return;
        }

        if (this._infoIframeClosed) {
            this.infoIndicator.classList.remove('visible');
            return;
        }

        this.infoIndicator.classList.add('visible');
        this.updateInfoIndicatorColor();
    }

    initInfoPopupHover() {
        const badge = document.getElementById('ooo-badge');

        if (!badge || !this.infoContainer) return;

        if (this._infoHoverInitialized) return;
        this._infoHoverInitialized = true;

        let hoverTimeout = null;
        let hideTimeout = null;
        let isHoveringBadge = false;
        let isHoveringInfo = false;

        const showInfo = () => {
            if (this._infoIframeClosed) return;
            clearTimeout(hideTimeout);
            hoverTimeout = setTimeout(() => {
                if (this.infoContainer.classList.contains('has-content')) {
                    this.infoContainer.classList.add('show');
                }
            }, 200);
        };

        const hideInfo = () => {
            clearTimeout(hoverTimeout);
            hideTimeout = setTimeout(() => {
                if (!isHoveringBadge && !isHoveringInfo) {
                    this.infoContainer.classList.remove('show');
                }
            }, 100);
        };

        badge.addEventListener('mouseenter', () => {
            isHoveringBadge = true;
            showInfo();
        });

        badge.addEventListener('mouseleave', () => {
            isHoveringBadge = false;
            hideInfo();
        });

        this.infoContainer.addEventListener('mouseenter', () => {
            isHoveringInfo = true;
            clearTimeout(hideTimeout);
        });

        this.infoContainer.addEventListener('mouseleave', () => {
            isHoveringInfo = false;
            hideInfo();
        });

        const closeBtn = this.infoContainer.querySelector('.info-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._infoIframeClosed = true;
                this.infoContainer.classList.remove('show');
                this.infoContainer.style.display = 'none';
                if (this.infoIndicator) this.infoIndicator.classList.remove('visible');
                this.refreshInfoIndicator();
            });
        }
    }
}
