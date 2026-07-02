const API_BASE_URL = '[YOUR_SERVER_URL]';
const APP_NAME = '[YOUR_AGENT_NAME]';

let currentUserId = null;
let currentSessionId = null;
let conversationHistory = [];

const chatWindow = document.getElementById('chatWindow');
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const downloadBtn = document.getElementById('downloadBtn');

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

const generateRandomId = () => Math.floor(Math.random() * 1000000000).toString();

async function initSession() {
    let uid = getCookie('userId');
    let sid = getCookie('sessionId');

    if (!uid || !sid) {
        uid = `u_${generateRandomId()}`;
        sid = `s_${generateRandomId()}`;
        
        try {
            const response = await fetch(`${API_BASE_URL}/apps/${APP_NAME}/users/${uid}/sessions/${sid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setCookie('userId', uid, 30);
                setCookie('sessionId', sid, 30);
            } else {
                throw new Error("Failed to initialize session on backend.");
            }
        } catch (error) {
            console.error("Initialization Error:", error);
            appendMessage('agent', "System error: Unable to connect to the backend agent server. Please try again later.");
            return;
        }
    }

    currentUserId = uid;
    currentSessionId = sid;
    
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    const thinkingId = showThinkingIndicator();
    
    let isThinking = true;
    let fullAgentText = '';
    let agentMessageWrapper = null;

    try {
        const payload = {
            appName: APP_NAME,
            userId: currentUserId,
            sessionId: currentSessionId,
            newMessage: {
                role: "user",
                parts: [{ text: text }]
            },
            streaming: true
        };

        const response = await fetch(`${API_BASE_URL}/run_sse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            let boundary = buffer.indexOf('\n\n');
            while (boundary !== -1) {
                const chunk = buffer.slice(0, boundary).trim();
                buffer = buffer.slice(boundary + 2);

                if (chunk.startsWith('data: ')) {
                    const dataStr = chunk.slice(6).trim();
                    
                    if (!dataStr) {
                        boundary = buffer.indexOf('\n\n');
                        continue;
                    }

                    try {
                        const data = JSON.parse(dataStr);
                        // console.log(data);
                        const parts = data.content?.parts || [];
                        const role = data.content?.role;
                        const isPartial = data.partial;

                        if (role === 'model' && isPartial) {                           
                            for (const part of parts) {
                                if (part.text) {
                                    if (isThinking) {
                                        removeThinkingIndicator(thinkingId);
                                        isThinking = false;
                                        agentMessageWrapper = document.createElement('div');
                                        agentMessageWrapper.classList.add('chat-bubble', 'agent-bubble', 'align-self-start', 'mb-3', 'shadow-sm');
                                        chatWindow.appendChild(agentMessageWrapper);
                                    }
                                    
                                    fullAgentText += part.text;
                                    agentMessageWrapper.innerHTML = marked.parse(fullAgentText);
                                    scrollToBottom();
                                }
                            }
                        } 
                    } catch (err) {
                        console.warn("Failed to parse SSE JSON chunk:", err, chunk);
                    }
                }
                boundary = buffer.indexOf('\n\n');
            }
        }

        if (isThinking) {
            removeThinkingIndicator(thinkingId);
            appendMessage('agent', "**Error:** The agent finished its process but returned no text.");
        } else {
            conversationHistory.push({ role: 'agent', text: fullAgentText });
        }
    } catch (error) {
        console.error("Query Error:", error);
        if (isThinking) {
            removeThinkingIndicator(thinkingId);
            appendMessage('agent', "**Error:** I'm having trouble connecting right now, or the connection dropped. Please try again.");
        } else {
            agentMessageWrapper.innerHTML += "<br><br>*(Connection interrupted: I am continuing this heavy analysis in the background. Please ask for an update in a minute or two!)*";
            conversationHistory.push({ role: 'agent', text: fullAgentText + "\n\n*(Connection interrupted)*" });
            scrollToBottom();
        }
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});

function appendMessage(role, text) {
    conversationHistory.push({ role, text });

    const wrapper = document.createElement('div');
    wrapper.classList.add('chat-bubble', 'mb-3', 'shadow-sm');

    if (role === 'user') {
        wrapper.classList.add('user-bubble', 'align-self-end');
        wrapper.textContent = text; 
    } else {
        wrapper.classList.add('agent-bubble', 'align-self-start');
        wrapper.innerHTML = marked.parse(text);
    }

    chatWindow.appendChild(wrapper);
    scrollToBottom();
}

function showThinkingIndicator() {
    const id = 'thinking-' + Date.now();
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.classList.add('chat-bubble', 'agent-bubble', 'align-self-start', 'mb-3', 'shadow-sm');
    
    const dots = document.createElement('div');
    dots.classList.add('dot-flashing');
    
    wrapper.appendChild(dots);
    chatWindow.appendChild(wrapper);
    scrollToBottom();
    return id;
}

function removeThinkingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

downloadBtn.addEventListener('click', () => {
    if (conversationHistory.length === 0) {
        alert("There is no conversation to download yet.");
        return;
    }

    let fileContent = "=========================================\n";
    fileContent += "   GOOGLE ADK EQUITY ANALYST - CHAT LOG  \n";
    fileContent += "=========================================\n\n";

    conversationHistory.forEach(msg => {
        const roleStr = msg.role === 'user' ? 'YOU' : 'EQUITY ANALYST';
        fileContent += `[${roleStr}]\n${msg.text}\n\n`;
        fileContent += "-----------------------------------------\n\n";
    });

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `EquityAnalyst_Chat_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.addEventListener('DOMContentLoaded', initSession);