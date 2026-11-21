const Modal = {
    show(title, contentHtml) {
        const root = document.getElementById('modal-root');
        root.innerHTML = `
            <div class="modal-overlay" onclick="if(event.target===this)Modal.close()">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="Modal.close()" aria-label="Close modal">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <div class="modal-body">${contentHtml}</div>
                </div>
            </div>
        `;
    },

    close() {
        const root = document.getElementById('modal-root');
        if (root) root.innerHTML = '';
    }
};
