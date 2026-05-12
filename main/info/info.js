function closeInfo() { 
    if (window.parent !== window) { 
        window.parent.postMessage('closeInfoIframe', '*'); 
    } else { 
        document.querySelector('.info-container').style.display = 'none'; 
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.info-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeInfo);
    }
});

async function loadConfig() {
    const remoteUrl = 'https://rudan177.github.io/OOOInterface/info/info-interface-5.1.json';
    
    try {
        const response = await fetch(remoteUrl + '?t=' + Date.now());
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

window.onload = async function() {
    const config = await loadConfig();
    var h1Element = document.querySelector('.info-container h1');
    var spanElement = document.querySelector('.info-container p span');
    
    if (config) {
        const titleEmpty = !config.title || config.title.trim() === '';
        const linkEmpty = !config.link || config.link.trim() === '';
        const textEmpty = !config.text || config.text.trim() === '';
        
        if (titleEmpty && linkEmpty && textEmpty) {
            if (window.parent !== window) { 
                window.parent.postMessage('noContent', '*'); 
            } else { 
                document.querySelector('.info-container').style.display = 'none'; 
            }
            return;
        }
        
        if (h1Element && config.title) h1Element.textContent = config.title;
        if (spanElement && config.link && config.text) {
            spanElement.innerHTML = `<a href="${config.link}" target="_blank">${config.text}</a>`;
        }
    }
    
    var h1Text = h1Element ? h1Element.textContent.trim() : '';
    var pText = spanElement ? spanElement.textContent.trim() : '';
    
    if (h1Text === '' && pText === '') { 
        if (window.parent !== window) { 
            window.parent.postMessage('noContent', '*'); 
        } else { 
            document.querySelector('.info-container').style.display = 'none'; 
        } 
    } 

    var container = document.querySelector('.scrollable-content'); 
    if (container) {
        container.addEventListener('wheel', function(e) { 
            e.preventDefault(); 
            container.scrollLeft += e.deltaY || e.deltaX; 
        }); 
    }
};

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('blur') === '1') {
    document.body.classList.add('dynamic-blur');
}
