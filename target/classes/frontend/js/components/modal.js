const Modal = {
    show(title, contentHtml) {
        const root = document.getElementById('modal-root');
        root.innerHTML = `
            <div class="modal-overlay" onclick="if(event.target===this)Modal.close()">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="Modal.close()">✕</button>
                    </div>
                    <div class="modal-body">${contentHtml}</div>
                </div>
            </div>
        `;
    },

    close() {
        document.getElementById('modal-root').innerHTML = '';
    }
};
