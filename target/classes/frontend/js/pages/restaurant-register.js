const RestaurantRegisterPage = {
    render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="container section fade-in" style="max-width:700px">
                <div class="dashboard-header">
                    <h1>🏪 Register Restaurant</h1>
                    <p>Fill in the details to register your restaurant on Elysian Delicacies</p>
                </div>

                <div class="card">
                    <form onsubmit="RestaurantRegisterPage.handleSubmit(event)" id="register-restaurant-form">
                        <div class="form-group">
                            <label class="form-label">Restaurant Name *</label>
                            <input type="text" class="form-input" id="rest-name" required placeholder="e.g., Dhaka Kitchen">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description *</label>
                            <input type="text" class="form-input" id="rest-desc" required placeholder="What makes your restaurant special?">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cuisine Type *</label>
                            <select class="form-select" id="rest-cuisine" required>
                                <option value="Bengali">Bengali</option>
                                <option value="Italian">Italian</option>
                                <option value="Chinese">Chinese</option>
                                <option value="American">American</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Indian">Indian</option>
                                <option value="Thai">Thai</option>
                                <option value="Korean">Korean</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Mediterranean">Mediterranean</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Opening Time</label>
                                <input type="text" class="form-input" id="rest-open" value="09:00 AM" placeholder="09:00 AM">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Closing Time</label>
                                <input type="text" class="form-input" id="rest-close" value="11:00 PM" placeholder="11:00 PM">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Delivery Fee (৳)</label>
                                <input type="number" class="form-input" id="rest-delivery-fee" value="50" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Est. Delivery Time (min)</label>
                                <input type="number" class="form-input" id="rest-delivery-time" value="30" min="10">
                            </div>
                        </div>
                        
                        <h3 style="font-family:var(--font-heading);margin:24px 0 16px">📍 Address</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Area *</label>
                                <input type="text" class="form-input" id="rest-area" required placeholder="e.g., Gulshan">
                            </div>
                            <div class="form-group">
                                <label class="form-label">City</label>
                                <input type="text" class="form-input" id="rest-city" value="Dhaka">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Street</label>
                            <input type="text" class="form-input" id="rest-street" placeholder="Street address">
                        </div>

                        <button type="submit" class="btn btn-primary btn-block btn-lg" id="reg-rest-btn" style="margin-top:16px">
                            🏪 Register Restaurant
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    async handleSubmit(e) {
        e.preventDefault();
        const btn = document.getElementById('reg-rest-btn');
        btn.disabled = true;
        btn.textContent = 'Registering...';

        try {
            const user = Session.getUser();
            const data = {
                ownerId: user.id,
                name: document.getElementById('rest-name').value,
                description: document.getElementById('rest-desc').value,
                cuisineType: document.getElementById('rest-cuisine').value,
                openingTime: document.getElementById('rest-open').value,
                closingTime: document.getElementById('rest-close').value,
                deliveryFee: parseFloat(document.getElementById('rest-delivery-fee').value),
                estimatedDeliveryMinutes: parseInt(document.getElementById('rest-delivery-time').value),
                address: {
                    area: document.getElementById('rest-area').value,
                    street: document.getElementById('rest-street').value,
                    city: document.getElementById('rest-city').value,
                    latitude: 23.7925,
                    longitude: 90.4078
                }
            };

            await API.createRestaurant(data);
            showToast('Restaurant registered successfully! 🎉', 'success');
            App.navigate('owner-dashboard');
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = '🏪 Register Restaurant';
        }
    }
};
