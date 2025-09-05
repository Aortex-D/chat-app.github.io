const chatMessages = document.getElementById('chatMessages');
const optionsContainer = document.getElementById('optionsContainer');
const chatOptions = document.getElementById('chatOptions');

let isChatClosed = false;

// Chat data structure
const chatData = {
    main: {
        message: "Hey! How may I assist you today?",
        options: [
            { id: 'payment', text: 'Payment Issue', type: 'submenu' },
            { id: 'bug', text: 'Report a Bug', type: 'response', response: 'Thank you for reporting a bug! Please describe the issue you\'re experiencing and we\'ll investigate it immediately. Our development team will get back to you within 24 hours.' },
            { id: 'contact', text: 'Contact Support', type: 'response', response: 'You can reach our support team through:\n\n📧 Email: support@company.com\n📞 Phone: +1 (555) 123-4567\n💬 Live Chat: Available 24/7\n\nOur average response time is under 2 hours!' },
            { id: 'account', text: 'Account Issues', type: 'submenu' }
        ]
    },
    payment: {
        message: "What payment issue can I help you with?",
        options: [
            { id: 'deposit', text: 'Deposit Issue', type: 'response', response: 'I understand you\'re having trouble with a deposit. Here are the most common solutions:\n\n1. Check if your payment method is valid and has sufficient funds\n2. Verify your account is fully verified\n3. Clear your browser cache and try again\n\nIf the issue persists, please contact our payment specialists directly.' },
            { id: 'withdrawal', text: 'Withdrawal Issue', type: 'response', response: 'For withdrawal issues, please check:\n\n1. Your account has completed the verification process\n2. You\'ve met the minimum withdrawal amount\n3. Your withdrawal method matches your deposit method\n\nProcessing usually takes 1-3 business days. If it\'s been longer, we\'ll investigate immediately!' },
            { id: 'purchase', text: 'How to make a purchase', type: 'response', response: 'Making a purchase is easy! Follow these steps:\n\n1. Browse our products and select what you want\n2. Add items to your cart\n3. Proceed to checkout\n4. Choose your payment method\n5. Complete the secure payment\n\nWe accept all major credit cards, PayPal, and bank transfers. Need help with a specific step?' }
        ]
    },
    account: {
        message: "What account issue do you need help with?",
        options: [
            { id: 'login', text: 'Login Problems', type: 'response', response: 'Having trouble logging in? Try these steps:\n\n1. Double-check your email and password\n2. Try resetting your password\n3. Clear your browser cookies\n4. Disable browser extensions temporarily\n\nIf you\'re still unable to access your account, we can help you recover it securely.' },
            { id: 'verification', text: 'Account Verification', type: 'response', response: 'Account verification typically takes 24-48 hours. You\'ll need:\n\n✓ Government-issued photo ID\n✓ Proof of address (utility bill or bank statement)\n✓ Clear, readable photos\n\nOnce submitted, our team will review and notify you via email. Premium members get priority verification!' },
            { id: 'settings', text: 'Profile Settings', type: 'response', response: 'You can update your profile settings by:\n\n1. Going to Account > Profile Settings\n2. Updating your personal information\n3. Changing notification preferences\n4. Managing privacy settings\n\nRemember to save changes before leaving the page. Some changes may require email verification.' }
        ]
    }
};

function addMessage(content, isBot = true) {
    const messageDiv = document.createElement('div');
    
    if (isBot) {
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="bot-avatar">🤖</div>
            <div class="message-content">${content}</div>
        `;
    } else {
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message typing-indicator';
    typingDiv.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

function showOptions(menuKey, showBack = false) {
    if (isChatClosed) return;
    
    optionsContainer.innerHTML = '';
    const menu = chatData[menuKey];
    
    if (showBack) {
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = '← Back to Main Menu';
        backButton.onclick = () => showOptions('main');
        optionsContainer.appendChild(backButton);
    }
    
    menu.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option.text;
        button.onclick = () => handleOptionClick(option);
        optionsContainer.appendChild(button);
    });
}

function handleOptionClick(option) {
    if (isChatClosed) return;
    
    // Show user selection
    addMessage(option.text, false);
    
    // Disable buttons temporarily
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        if (option.type === 'submenu') {
            // Show submenu
            const typing = showTypingIndicator();
            setTimeout(() => {
                typing.remove();
                addMessage(chatData[option.id].message);
                showOptions(option.id, true);
                
                // Re-enable buttons
                const newButtons = optionsContainer.querySelectorAll('button');
                newButtons.forEach(btn => btn.disabled = false);
            }, 1500);
        } else {
            // Show response
            const typing = showTypingIndicator();
            setTimeout(() => {
                typing.remove();
                addMessage(option.response);
                showSatisfactionSurvey();
            }, 2000);
        }
    }, 300);
}

function showSatisfactionSurvey() {
    setTimeout(() => {
        addMessage("Is your issue solved?");
        
        optionsContainer.innerHTML = '';
        
        const yesButton = document.createElement('button');
        yesButton.className = 'option-button';
        yesButton.textContent = 'Yes';
        yesButton.onclick = () => handleSatisfactionResponse(true);
        
        const noButton = document.createElement('button');
        noButton.className = 'option-button';
        noButton.textContent = 'No';
        noButton.onclick = () => handleSatisfactionResponse(false);
        
        optionsContainer.appendChild(yesButton);
        optionsContainer.appendChild(noButton);
    }, 1000);
}

function handleSatisfactionResponse(isSolved) {
    addMessage(isSolved ? 'Yes' : 'No', false);
    
    // Disable buttons
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    const typing = showTypingIndicator();
    setTimeout(() => {
        typing.remove();
        
        if (isSolved) {
            addMessage("Thank you for using our service! We're glad we could help resolve your issue. Have a great day! 😊");
        } else {
            addMessage("We're sorry we couldn't fully resolve your issue. Please contact our support team at support@company.com for detailed guidance. Our specialists will assist you further.");
        }
        
        closeChat();
    }, 2000);
}

function closeChat() {
    setTimeout(() => {
        isChatClosed = true;
        chatOptions.innerHTML = '<div class="chat-closed-message">Chat is closed</div>';
    }, 2000);
}

// Initialize chat
function startChat() {
    const typing = showTypingIndicator();
    setTimeout(() => {
        typing.remove();
        addMessage(chatData.main.message);
        showOptions('main');
    }, 1500);
}

// Start the application
startChat();
