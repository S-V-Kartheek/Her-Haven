document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        
        const messageContent = document.createElement('p');
        messageContent.className = isUser 
            ? 'bg-green-100 p-3 rounded-lg ml-auto max-w-[80%]'
            : 'bg-blue-100 p-3 rounded-lg max-w-[80%]';
        
        // Remove markdown bold indicators (**) and replace newline characters with <br> for proper formatting
        let formattedMessage = message.replace(/\*\*/g, '');
        formattedMessage = formattedMessage.replace(/\n/g, '<br>');

        messageContent.innerHTML = formattedMessage;
        
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.');
        }
    }

    chatForm.addEventListener('submit', handleSubmit);
}); 