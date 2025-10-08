class ModelComparator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadSavedConfigs();
        
        // Conversation history management
        this.conversationHistoryA = [];
        this.conversationHistoryB = [];
        this.hasActiveConversation = false;
        
        // Custom API and model data
        this.customApis = this.loadCustomApis();
        this.customModels = this.loadCustomModels();
        
        // Initialize dropdowns
        this.updateDropdownOptions();
    }

    initializeElements() {
        // API configuration elements
        this.apiUrlA = document.getElementById('api-url-a');
        this.modelNameA = document.getElementById('model-name-a');
        this.apiKeyA = document.getElementById('api-key-a');
        
        this.apiUrlB = document.getElementById('api-url-b');
        this.modelNameB = document.getElementById('model-name-b');
        this.apiKeyB = document.getElementById('api-key-b');

        // Prompt elements
        this.systemPrompt = document.getElementById('system-prompt');
        this.userPrompt = document.getElementById('user-prompt');
        this.sendBtn = document.getElementById('send-btn');
        this.clearSystemBtn = document.getElementById('clear-system');
        this.clearUserBtn = document.getElementById('clear-user');
        this.presetSelect = document.getElementById('preset-prompts');
        
        // System prompt toggle related elements
        this.systemSharedToggle = document.getElementById('system-shared-toggle');
        this.systemToggleLabel = document.getElementById('system-toggle-label');
        this.systemSharedContainer = document.getElementById('system-shared-container');
        this.systemSeparateContainer = document.getElementById('system-separate-container');
        this.systemPromptA = document.getElementById('system-prompt-a');
        this.systemPromptB = document.getElementById('system-prompt-b');
        
        // Dropdown select elements
        this.apiUrlSelectA = document.getElementById('api-url-select-a');
        this.apiUrlSelectB = document.getElementById('api-url-select-b');
        this.modelSelectA = document.getElementById('model-select-a');
        this.modelSelectB = document.getElementById('model-select-b');
        
        // Management modal elements
        this.manageApisBtn = document.getElementById('manage-apis');
        this.manageModelsBtn = document.getElementById('manage-models');
        this.apiModal = document.getElementById('api-management-modal');
        this.modelModal = document.getElementById('model-management-modal');
        this.closeApiModal = document.getElementById('close-api-modal');
        this.closeModelModal = document.getElementById('close-model-modal');
        
        // User input toggle related elements
        this.userSharedToggle = document.getElementById('user-shared-toggle');
        this.userToggleLabel = document.getElementById('user-toggle-label');
        this.userSharedContainer = document.getElementById('user-shared-container');
        this.userSeparateContainer = document.getElementById('user-separate-container');
        this.userPromptA = document.getElementById('user-prompt-a');
        this.userPromptB = document.getElementById('user-prompt-b');
        this.sendBtnA = document.getElementById('send-btn-a');
        this.sendBtnB = document.getElementById('send-btn-b');
        this.sendBothBtn = document.getElementById('send-both-btn');
        this.newConversationBtnSeparate = document.getElementById('new-conversation-btn-separate');
        
        // Connection test buttons and status
        this.testBtnA = document.getElementById('test-connection-a');
        this.testBtnB = document.getElementById('test-connection-b');
        this.connectionStatusA = document.getElementById('connection-status-a');
        this.connectionStatusB = document.getElementById('connection-status-b');
        
        // Configuration collapse button
        this.toggleConfigBtn = document.getElementById('toggle-config');
        this.configContent = document.getElementById('config-content');
        
        // Follow-up feature related elements
        this.newConversationBtn = document.getElementById('new-conversation-btn');
        this.conversationHistoryElA = document.getElementById('conversation-history-a');
        this.conversationHistoryElB = document.getElementById('conversation-history-b');

        // Result display elements
        this.modelATitleEl = document.getElementById('model-a-title');
        this.modelBTitleEl = document.getElementById('model-b-title');
        this.statusA = document.getElementById('status-a');
        this.statusB = document.getElementById('status-b');
        this.timeA = document.getElementById('time-a');
        this.timeB = document.getElementById('time-b');
        this.tokensA = document.getElementById('tokens-a');
        this.tokensB = document.getElementById('tokens-b');
    }

    bindEvents() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Save configuration to localStorage
        [this.apiUrlA, this.modelNameA, this.apiKeyA, this.apiUrlB, this.modelNameB, this.apiKeyB, this.systemPrompt, this.systemPromptA, this.systemPromptB].forEach(input => {
            if (input) {
                input.addEventListener('change', () => this.saveConfigs());
                input.addEventListener('input', () => this.saveConfigs()); // Save in real-time
            }
        });

        // When the API URL input changes, clear the corresponding dropdown selection
        this.apiUrlA.addEventListener('input', () => {
            if (this.apiUrlA.value !== this.apiUrlSelectA.value) {
                this.apiUrlSelectA.value = '';
                this.apiUrlA.classList.remove('custom-active');
            }
        });
        this.apiUrlB.addEventListener('input', () => {
            if (this.apiUrlB.value !== this.apiUrlSelectB.value) {
                this.apiUrlSelectB.value = '';
                this.apiUrlB.classList.remove('custom-active');
            }
        });

        // When the model name input changes, clear the corresponding dropdown selection
        this.modelNameA.addEventListener('input', () => {
            if (this.modelNameA.value !== this.modelSelectA.value) {
                this.modelSelectA.value = '';
                this.modelNameA.classList.remove('custom-active');
            }
        });
        this.modelNameB.addEventListener('input', () => {
            if (this.modelNameB.value !== this.modelSelectB.value) {
                this.modelSelectB.value = '';
                this.modelNameB.classList.remove('custom-active');
            }
        });

        // Update model titles
        this.modelNameA.addEventListener('input', () => {
            this.modelATitleEl.textContent = this.modelNameA.value || 'Model A';
        });
        this.modelNameB.addEventListener('input', () => {
            this.modelBTitleEl.textContent = this.modelNameB.value || 'Model B';
        });

        // System prompt toggle event
        this.systemSharedToggle.addEventListener('change', () => this.toggleSystemPromptMode());
        
        // User input toggle event
        this.userSharedToggle.addEventListener('change', () => this.toggleUserInputMode());

        // Clear button events
        this.clearSystemBtn.addEventListener('click', () => this.clearSystemPrompts());
        this.clearUserBtn.addEventListener('click', () => this.clearUserPrompts());

        // Send button events in separate mode
        this.sendBtnA.addEventListener('click', () => this.sendMessageSeparate('A'));
        this.sendBtnB.addEventListener('click', () => this.sendMessageSeparate('B'));
        this.sendBothBtn.addEventListener('click', () => this.sendMessageSeparate('both'));
        this.newConversationBtnSeparate.addEventListener('click', () => this.startNewConversation());

        // Dropdown select events
        this.apiUrlSelectA.addEventListener('change', () => this.handleApiUrlSelect('A'));
        this.apiUrlSelectB.addEventListener('change', () => this.handleApiUrlSelect('B'));
        this.modelSelectA.addEventListener('change', () => this.handleModelSelect('A'));
        this.modelSelectB.addEventListener('change', () => this.handleModelSelect('B'));

        // Management modal events
        this.manageApisBtn.addEventListener('click', () => this.showApiManagement());
        this.manageModelsBtn.addEventListener('click', () => this.showModelManagement());
        this.closeApiModal.addEventListener('click', () => this.hideApiManagement());
        this.closeModelModal.addEventListener('click', () => this.hideModelManagement());
        
        // Close by clicking the modal background
        this.apiModal.addEventListener('click', (e) => {
            if (e.target === this.apiModal) this.hideApiManagement();
        });
        this.modelModal.addEventListener('click', (e) => {
            if (e.target === this.modelModal) this.hideModelManagement();
        });

        // Preset prompt selection
        this.presetSelect.addEventListener('change', () => {
            const presets = {
                'translate': 'Please translate the following text:\n\n',
                'code': 'Please help me analyze the following code and provide optimization suggestions:\n\n',
                'creative': 'Please create an imaginative short essay based on the following theme:\n\n',
                'analysis': 'Please conduct an in-depth analysis of the following data or problem:\n\n'
            };
            
            if (this.presetSelect.value && presets[this.presetSelect.value]) {
                if (this.userSharedToggle.checked) {
                    // Shared mode
                    this.userPrompt.value = presets[this.presetSelect.value];
                    this.userPrompt.focus();
                } else {
                    // Separate mode: fill in both input boxes
                    this.userPromptA.value = presets[this.presetSelect.value];
                    this.userPromptB.value = presets[this.presetSelect.value];
                    this.userPromptA.focus();
                }
                // Reset selector
                this.presetSelect.value = '';
            }
        });

        // Connection test button events
        this.testBtnA.addEventListener('click', () => this.testConnection('A'));
        this.testBtnB.addEventListener('click', () => this.testConnection('B'));

        // API URL auto-completion
        this.apiUrlA.addEventListener('blur', () => this.autoCompleteApiUrl(this.apiUrlA));
        this.apiUrlB.addEventListener('blur', () => this.autoCompleteApiUrl(this.apiUrlB));

        // New conversation button event
        this.newConversationBtn.addEventListener('click', () => this.startNewConversation());
        
        // Configuration collapse event
        this.toggleConfigBtn.addEventListener('click', () => this.toggleConfig());
    }

    // Switch system prompt mode
    toggleSystemPromptMode() {
        const isShared = this.systemSharedToggle.checked;
        
        if (isShared) {
            // Switch to shared mode
            this.systemSharedContainer.style.display = 'block';
            this.systemSeparateContainer.style.display = 'none';
            this.systemToggleLabel.textContent = 'Shared Mode';
        } else {
            // Switch to separate mode
            this.systemSharedContainer.style.display = 'none';
            this.systemSeparateContainer.style.display = 'block';
            this.systemToggleLabel.textContent = 'Separate Mode';
            
            // If shared mode has content, copy it to separate mode
            if (this.systemPrompt.value.trim()) {
                if (!this.systemPromptA.value.trim()) {
                    this.systemPromptA.value = this.systemPrompt.value;
                }
                if (!this.systemPromptB.value.trim()) {
                    this.systemPromptB.value = this.systemPrompt.value;
                }
            }
        }
        this.saveConfigs();
    }

    // Switch user input mode
    toggleUserInputMode() {
        const isShared = this.userSharedToggle.checked;
        
        if (isShared) {
            // Switch to shared mode
            this.userSharedContainer.style.display = 'block';
            this.userSeparateContainer.style.display = 'none';
            this.userToggleLabel.textContent = 'Shared Mode';
        } else {
            // Switch to separate mode
            this.userSharedContainer.style.display = 'none';
            this.userSeparateContainer.style.display = 'block';
            this.userToggleLabel.textContent = 'Separate Mode';
            
            // If shared mode has content, copy it to separate mode
            if (this.userPrompt.value.trim()) {
                if (!this.userPromptA.value.trim()) {
                    this.userPromptA.value = this.userPrompt.value;
                }
                if (!this.userPromptB.value.trim()) {
                    this.userPromptB.value = this.userPrompt.value;
                }
            }
        }
    }

    // Clear system prompts
    clearSystemPrompts() {
        if (this.systemSharedToggle.checked) {
            this.systemPrompt.value = '';
        } else {
            this.systemPromptA.value = '';
            this.systemPromptB.value = '';
        }
        this.saveConfigs();
    }

    // Clear user prompts
    clearUserPrompts() {
        if (this.userSharedToggle.checked) {
            this.userPrompt.value = '';
        } else {
            this.userPromptA.value = '';
            this.userPromptB.value = '';
        }
    }

    // Send message in separate mode
    async sendMessageSeparate(target) {
        // Validate input
        if (!this.validateInputsSeparate(target)) {
            return;
        }

        const sendToA = target === 'A' || target === 'both';
        const sendToB = target === 'B' || target === 'both';

        // Disable relevant buttons
        if (sendToA) {
            this.sendBtnA.disabled = true;
            this.sendBtnA.textContent = 'Sending...';
        }
        if (sendToB) {
            this.sendBtnB.disabled = true;
            this.sendBtnB.textContent = 'Sending...';
        }
        if (target === 'both') {
            this.sendBothBtn.disabled = true;
            this.sendBothBtn.textContent = 'Sending...';
        }

        try {
            const promises = [];
            
            if (sendToA) {
                // Add user message to history A
                const userMessageA = this.userPromptA.value.trim();
                this.addToConversationHistory('A', 'user', userMessageA);
                promises.push(this.callModel('A'));
                // Clear input box A
                this.userPromptA.value = '';
            }
            
            if (sendToB) {
                // Add user message to history B
                const userMessageB = this.userPromptB.value.trim();
                this.addToConversationHistory('B', 'user', userMessageB);
                promises.push(this.callModel('B'));
                // Clear input box B
                this.userPromptB.value = '';
            }

            await Promise.all(promises);
            this.hasActiveConversation = true;
            
        } catch (error) {
            console.error('An error occurred while sending the message:', error);
        } finally {
            // Restore buttons
            if (sendToA) {
                this.sendBtnA.disabled = false;
                this.sendBtnA.textContent = 'Send A';
            }
            if (sendToB) {
                this.sendBtnB.disabled = false;
                this.sendBtnB.textContent = 'Send B';
            }
            if (target === 'both') {
                this.sendBothBtn.disabled = false;
                this.sendBothBtn.textContent = 'Send Both';
            }
        }
    }

    // Separate mode input validation
    validateInputsSeparate(target) {
        const requiredFields = [
            { element: this.apiUrlA, name: "Model A's API URL" },
            { element: this.modelNameA, name: "Model A's Name" },
            { element: this.apiKeyA, name: "Model A's API Key" },
            { element: this.apiUrlB, name: "Model B's API URL" },
            { element: this.modelNameB, name: "Model B's Name" },
            { element: this.apiKeyB, name: "Model B's API Key" }
        ];

        // Validate basic configuration
        for (const field of requiredFields) {
            if (!field.element.value.trim()) {
                alert(`Please fill in ${field.name}`);
                field.element.focus();
                return false;
            }
        }

        // Validate user input
        if (target === 'A' || target === 'both') {
            if (!this.userPromptA.value.trim()) {
                alert('Please enter content for Model A');
                this.userPromptA.focus();
                return false;
            }
        }
        
        if (target === 'B' || target === 'both') {
            if (!this.userPromptB.value.trim()) {
                alert('Please enter content for Model B');
                this.userPromptB.focus();
                return false;
            }
        }

        return true;
    }

    // Handle API URL dropdown selection
    handleApiUrlSelect(model) {
        const isModelA = model === 'A';
        const selectElement = isModelA ? this.apiUrlSelectA : this.apiUrlSelectB;
        const inputElement = isModelA ? this.apiUrlA : this.apiUrlB;
        
        const selectedValue = selectElement.value;
        
        if (selectedValue === 'custom') {
            // Select custom, highlight the input box
            inputElement.classList.add('custom-active');
            inputElement.focus();
            inputElement.placeholder = 'Enter custom API URL';
        } else if (selectedValue) {
            // Select preset API
            inputElement.classList.remove('custom-active');
            inputElement.value = selectedValue;
            inputElement.placeholder = 'Or enter API URL directly';
            this.saveConfigs();
        } else {
            // Clear selection
            inputElement.classList.remove('custom-active');
            inputElement.placeholder = 'Or enter API URL directly';
        }
    }

    // Handle model dropdown selection
    handleModelSelect(model) {
        const isModelA = model === 'A';
        const selectElement = isModelA ? this.modelSelectA : this.modelSelectB;
        const inputElement = isModelA ? this.modelNameA : this.modelNameB;
        
        const selectedValue = selectElement.value;
        
        if (selectedValue === 'custom') {
            // Select custom, highlight the input box
            inputElement.classList.add('custom-active');
            inputElement.focus();
            inputElement.placeholder = 'Enter custom model name';
        } else if (selectedValue) {
            // Select preset model
            inputElement.classList.remove('custom-active');
            inputElement.value = selectedValue;
            inputElement.placeholder = 'Or enter model name directly';
            this.saveConfigs();
        } else {
            // Clear selection
            inputElement.classList.remove('custom-active');
            inputElement.placeholder = 'Or enter model name directly';
        }
    }

    saveConfigs() {
        const configs = {
            apiUrlA: this.apiUrlA.value,
            modelNameA: this.modelNameA.value,
            apiKeyA: this.apiKeyA.value,
            apiUrlB: this.apiUrlB.value,
            modelNameB: this.modelNameB.value,
            apiKeyB: this.apiKeyB.value,
            systemPrompt: this.systemPrompt.value,
            systemPromptA: this.systemPromptA ? this.systemPromptA.value : '',
            systemPromptB: this.systemPromptB ? this.systemPromptB.value : '',
            systemSharedMode: this.systemSharedToggle.checked,
            userSharedMode: this.userSharedToggle.checked,
            // Save dropdown selection state
            apiUrlSelectA: this.apiUrlSelectA.value,
            apiUrlSelectB: this.apiUrlSelectB.value,
            modelSelectA: this.modelSelectA.value,
            modelSelectB: this.modelSelectB.value
        };
        localStorage.setItem('modelConfigs', JSON.stringify(configs));
    }

    loadSavedConfigs() {
        const savedConfigs = localStorage.getItem('modelConfigs');
        if (savedConfigs) {
            const configs = JSON.parse(savedConfigs);
            this.apiUrlA.value = configs.apiUrlA || '';
            this.modelNameA.value = configs.modelNameA || '';
            this.apiKeyA.value = configs.apiKeyA || '';
            this.apiUrlB.value = configs.apiUrlB || '';
            this.modelNameB.value = configs.modelNameB || '';
            this.apiKeyB.value = configs.apiKeyB || '';
            this.systemPrompt.value = configs.systemPrompt || '';
            
            // Load system prompts for separate mode
            if (this.systemPromptA) this.systemPromptA.value = configs.systemPromptA || '';
            if (this.systemPromptB) this.systemPromptB.value = configs.systemPromptB || '';
            
            // Restore toggle state
            if (configs.systemSharedMode !== undefined) {
                this.systemSharedToggle.checked = configs.systemSharedMode;
                this.toggleSystemPromptMode();
            }
            if (configs.userSharedMode !== undefined) {
                this.userSharedToggle.checked = configs.userSharedMode;
                this.toggleUserInputMode();
            }
            
            // Restore dropdown selection state
            if (configs.apiUrlSelectA) {
                this.apiUrlSelectA.value = configs.apiUrlSelectA;
            }
            if (configs.apiUrlSelectB) {
                this.apiUrlSelectB.value = configs.apiUrlSelectB;
            }
            if (configs.modelSelectA) {
                this.modelSelectA.value = configs.modelSelectA;
            }
            if (configs.modelSelectB) {
                this.modelSelectB.value = configs.modelSelectB;
            }
            
            // Update titles
            this.modelATitleEl.textContent = configs.modelNameA || 'Model A';
            this.modelBTitleEl.textContent = configs.modelNameB || 'Model B';
        }
    }

    async sendMessage() {
        // Validate input
        if (!this.validateInputs()) {
            return;
        }

        // Disable send button
        this.sendBtn.disabled = true;
        const originalText = this.sendBtn.textContent;
        this.sendBtn.textContent = 'Sending...';

        // Add user message to history
        const userMessage = this.userPrompt.value.trim();
        this.addToConversationHistory('A', 'user', userMessage);
        this.addToConversationHistory('B', 'user', userMessage);

        // Clear input box
        this.userPrompt.value = '';

        // Call both models in parallel
        const promises = [
            this.callModel('A'),
            this.callModel('B')
        ];

        try {
            await Promise.all(promises);
            this.hasActiveConversation = true;
        } catch (error) {
            console.error('An error occurred while sending the message:', error);
        } finally {
            // Restore buttons
            this.sendBtn.disabled = false;
            this.sendBtn.textContent = originalText;
        }
    }

    validateInputs(isFollowUp = false) {
        const requiredFields = [
            { element: this.apiUrlA, name: "Model A's API URL" },
            { element: this.modelNameA, name: "Model A's Name" },
            { element: this.apiKeyA, name: "Model A's API Key" },
            { element: this.apiUrlB, name: "Model B's API URL" },
            { element: this.modelNameB, name: "Model B's Name" },
            { element: this.apiKeyB, name: "Model B's API Key" },
            { element: this.userPrompt, name: isFollowUp ? 'follow-up content' : 'user prompt' }
        ];

        for (const field of requiredFields) {
            if (!field.element.value.trim()) {
                alert(`Please fill in ${field.name}`);
                field.element.focus();
                return false;
            }
        }
        return true;
    }

    resetResults() {
        this.responseA.textContent = '';
        this.responseB.textContent = '';
        this.timeA.textContent = '';
        this.timeB.textContent = '';
        this.tokensA.textContent = '';
        this.tokensB.textContent = '';
        this.updateStatus('A', 'loading', 'Requesting...');
        this.updateStatus('B', 'loading', 'Requesting...');
    }

    updateStatus(model, type, text) {
        const statusEl = model === 'A' ? this.statusA : this.statusB;
        statusEl.className = `status ${type}`;
        statusEl.textContent = text;
    }

    autoCompleteApiUrl(inputElement) {
        let url = inputElement.value.trim();
        if (!url) return;

        // Common API URL auto-completions
        const completions = {
            'https://openrouter.ai/api/v1': 'https://openrouter.ai/api/v1/chat/completions',
            'https://openrouter.ai/api/v1/': 'https://openrouter.ai/api/v1/chat/completions',
            'https://api.openai.com/v1': 'https://api.openai.com/v1/chat/completions',
            'https://api.openai.com/v1/': 'https://api.openai.com/v1/chat/completions'
        };

        if (completions[url]) {
            inputElement.value = completions[url];
            inputElement.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                inputElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    toggleConfig() {
        const isCollapsed = this.configContent.classList.contains('collapsed');
        if (isCollapsed) {
            this.configContent.classList.remove('collapsed');
            this.toggleConfigBtn.textContent = 'Collapse Config';
        } else {
            this.configContent.classList.add('collapsed');
            this.toggleConfigBtn.textContent = 'Expand Config';
        }
    }

    // Conversation history management methods
    addToConversationHistory(model, role, content) {
        const history = model === 'A' ? this.conversationHistoryA : this.conversationHistoryB;
        history.push({ role, content });
        this.updateConversationHistoryDisplay(model);
    }

    updateConversationHistoryDisplay(model) {
        const history = model === 'A' ? this.conversationHistoryA : this.conversationHistoryB;
        const historyElement = model === 'A' ? this.conversationHistoryElA : this.conversationHistoryElB;

        if (history.length === 0) {
            historyElement.innerHTML = '<div class="empty-state">Waiting to start conversation...</div>';
            return;
        }

        historyElement.innerHTML = history.map(item => `
            <div class="history-item ${item.role}" onclick="navigator.clipboard.writeText('${item.content.replace(/'/g, "\\'")}')">
                <div class="role">${item.role === 'user' ? '👤 User' : '🤖 Assistant'}</div>
                <div class="content">${item.content}</div>
            </div>
        `).join('');

        // Scroll to the bottom
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    clearConversationHistory(model = null) {
        if (model === null || model === 'both') {
            this.conversationHistoryA = [];
            this.conversationHistoryB = [];
            this.updateConversationHistoryDisplay('A');
            this.updateConversationHistoryDisplay('B');
        } else if (model === 'A') {
            this.conversationHistoryA = [];
            this.updateConversationHistoryDisplay('A');
        } else if (model === 'B') {
            this.conversationHistoryB = [];
            this.updateConversationHistoryDisplay('B');
        }
    }


    startNewConversation() {
        this.clearConversationHistory('both');
        this.hasActiveConversation = false;
        this.timeA.textContent = '';
        this.timeB.textContent = '';
        this.tokensA.textContent = '';
        this.tokensB.textContent = '';
        this.updateStatus('A', 'ready', 'Ready');
        this.updateStatus('B', 'ready', 'Ready');
        this.userPrompt.focus();
    }

    async testConnection(model) {
        const isModelA = model === 'A';
        const apiUrl = isModelA ? this.apiUrlA.value : this.apiUrlB.value;
        const modelName = isModelA ? this.modelNameA.value : this.modelNameB.value;
        const apiKey = isModelA ? this.apiKeyA.value : this.apiKeyB.value;
        const testBtn = isModelA ? this.testBtnA : this.testBtnB;
        const statusEl = isModelA ? this.connectionStatusA : this.connectionStatusB;

        // Validate required fields
        if (!apiUrl || !modelName || !apiKey) {
            statusEl.className = 'connection-status-small error';
            statusEl.textContent = 'Please complete the configuration information';
            return;
        }

        // Set testing status
        testBtn.disabled = true;
        testBtn.textContent = '🔄 Testing...';
        statusEl.className = 'connection-status-small testing';
        statusEl.textContent = 'Testing connection...';

        try {
            const response = await this.makeAPIRequest(apiUrl, modelName, apiKey, [
                { role: 'user', content: 'Hello' }
            ]);

            // Test successful
            testBtn.textContent = '🔗 Test Connection';
            statusEl.className = 'connection-status-small success';
            statusEl.textContent = '✅ Connection successful';

        } catch (error) {
            console.error(`Model ${model} connection test failed:`, error);
            testBtn.textContent = '🔗 Test Connection';
            statusEl.className = 'connection-status-small error';
            statusEl.textContent = `❌ ${error.message}`;
        } finally {
            testBtn.disabled = false;
        }
    }

    async makeAPIRequest(apiUrl, modelName, apiKey, messages) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Model Comparison Tool'
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    max_tokens: 4000,
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Check response type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
                    throw new Error('API returned an HTML page, possibly a CORS error or incorrect API address');
                }
                throw new Error(`API returned a non-JSON response: ${contentType || 'Unknown type'}`);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || 
                                 errorData.message || 
                                 `HTTP ${response.status}: ${response.statusText}`;
                throw new Error(errorMsg);
            }

            return await response.json();

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out, please check your network connection');
            }
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Network error, possibly a CORS issue or network failure');
            }
            throw error;
        }
    }

    async callModel(model) {
        const isModelA = model === 'A';
        const apiUrl = isModelA ? this.apiUrlA.value : this.apiUrlB.value;
        const modelName = isModelA ? this.modelNameA.value : this.modelNameB.value;
        const apiKey = isModelA ? this.apiKeyA.value : this.apiKeyB.value;
        const timeEl = isModelA ? this.timeA : this.timeB;
        const tokensEl = isModelA ? this.tokensA : this.tokensB;

        const startTime = Date.now();

        try {
            // Build messages array
            const messages = [];
            
            // Add system prompt (only on the first turn of the conversation)
            const history = isModelA ? this.conversationHistoryA : this.conversationHistoryB;
            if (history.length === 1) {
                let systemPromptContent = '';
                
                if (this.systemSharedToggle.checked) {
                    // Shared mode: use the shared system prompt
                    systemPromptContent = this.systemPrompt.value.trim();
                } else {
                    // Separate mode: use respective system prompts
                    systemPromptContent = isModelA ? 
                        this.systemPromptA.value.trim() : 
                        this.systemPromptB.value.trim();
                }
                
                if (systemPromptContent) {
                    messages.push({
                        role: 'system',
                        content: systemPromptContent
                    });
                }
            }
            
            // Add conversation history
            messages.push(...history.map(item => ({
                role: item.role,
                content: item.content
            })));

            // Call API
            const data = await this.makeAPIRequest(apiUrl, modelName, apiKey, messages);
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Get response content
            const content = data.choices?.[0]?.message?.content || 'No response content';
            
            // Add assistant's response to conversation history
            this.addToConversationHistory(model, 'assistant', content);
            
            // Display metadata
            timeEl.textContent = `${duration}ms`;
            const tokens = data.usage?.total_tokens || 'N/A';
            tokensEl.textContent = `${tokens} tokens`;
            
            this.updateStatus(model, 'success', 'Complete');

        } catch (error) {
            console.error(`Model ${model} call failed:`, error);
            const errorMsg = `Error: ${error.message}`;
            
            // Add the error to the conversation history
            this.addToConversationHistory(model, 'assistant', errorMsg);
            
            this.updateStatus(model, 'error', 'Failed');
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            timeEl.textContent = `${duration}ms (failed)`;
        }
    }

    // Custom API management methods
    loadCustomApis() {
        const saved = localStorage.getItem('customApis');
        return saved ? JSON.parse(saved) : [];
    }

    saveCustomApis() {
        localStorage.setItem('customApis', JSON.stringify(this.customApis));
        this.updateDropdownOptions();
    }

    loadCustomModels() {
        const saved = localStorage.getItem('customModels');
        return saved ? JSON.parse(saved) : [];
    }

    saveCustomModels() {
        localStorage.setItem('customModels', JSON.stringify(this.customModels));
        this.updateDropdownOptions();
    }

    updateDropdownOptions() {
        // Update API dropdowns
        [this.apiUrlSelectA, this.apiUrlSelectB].forEach(select => {
            // Save current selection
            const currentValue = select.value;
            
            // Clear options, keeping the basic ones
            select.innerHTML = `
                <option value="">Select API URL...</option>
                <option value="https://api.openai.com/v1/chat/completions">OpenAI API</option>
                <option value="https://openrouter.ai/api/v1/chat/completions">OpenRouter API</option>
                <option value="https://api.anthropic.com/v1/messages">Anthropic Claude API</option>
                <option value="https://generativelanguage.googleapis.com/v1beta/models/">Google Gemini API</option>
            `;
            
            // Add custom APIs
            this.customApis.forEach(api => {
                const option = document.createElement('option');
                option.value = api.url;
                option.textContent = api.name;
                select.appendChild(option);
            });
            
            // Add custom option
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom...';
            select.appendChild(customOption);
            
            // Restore selection
            select.value = currentValue;
        });

        // Update model dropdowns
        [this.modelSelectA, this.modelSelectB].forEach(select => {
            // Save current selection
            const currentValue = select.value;
            
            // Clear options, keeping the basic ones
            select.innerHTML = `
                <option value="">Select Model...</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            `;
            
            // Add custom models
            this.customModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.display || model.name;
                select.appendChild(option);
            });
            
            // Add custom option
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom...';
            select.appendChild(customOption);
            
            // Restore selection
            select.value = currentValue;
        });
    }

    // API management modal methods
    showApiManagement() {
        this.apiModal.style.display = 'flex';
        this.renderApiList();
        
        // Bind add API event
        const addBtn = document.getElementById('add-api-btn');
        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        
        newAddBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('new-api-name');
            const urlInput = document.getElementById('new-api-url');
            
            const name = nameInput.value.trim();
            const url = urlInput.value.trim();
            
            if (!name || !url) {
                alert('Please enter API name and URL');
                return;
            }
            
            // Check if it already exists
            if (this.customApis.some(api => api.name === name || api.url === url)) {
                alert('API name or URL already exists');
                return;
            }
            
            this.customApis.push({ name, url });
            this.saveCustomApis();
            this.renderApiList();
            
            // Clear input fields
            nameInput.value = '';
            urlInput.value = '';
        });
    }

    hideApiManagement() {
        this.apiModal.style.display = 'none';
    }

    renderApiList() {
        const apiList = document.getElementById('api-list');
        
        if (this.customApis.length === 0) {
            apiList.innerHTML = '<div class="empty-list">No custom APIs yet</div>';
            return;
        }
        
        apiList.innerHTML = this.customApis.map((api, index) => `
            <div class="item-row" data-index="${index}">
                <div class="item-info">
                    <div class="item-name">${api.name}</div>
                    <div class="item-value">${api.url}</div>
                </div>
                <div class="edit-form">
                    <input type="text" class="edit-name" value="${api.name}" placeholder="API Name">
                    <input type="text" class="edit-url" value="${api.url}" placeholder="API URL">
                    <button class="save-btn">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
                <div class="item-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Bind edit and delete events
        apiList.addEventListener('click', (e) => {
            const row = e.target.closest('.item-row');
            const index = parseInt(row.dataset.index);
            
            if (e.target.classList.contains('edit-btn')) {
                row.classList.add('editing');
            } else if (e.target.classList.contains('cancel-btn')) {
                row.classList.remove('editing');
            } else if (e.target.classList.contains('save-btn')) {
                const name = row.querySelector('.edit-name').value.trim();
                const url = row.querySelector('.edit-url').value.trim();
                
                if (!name || !url) {
                    alert('Please enter API name and URL');
                    return;
                }
                
                this.customApis[index] = { name, url };
                this.saveCustomApis();
                this.renderApiList();
            } else if (e.target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this API?')) {
                    this.customApis.splice(index, 1);
                    this.saveCustomApis();
                    this.renderApiList();
                }
            }
        });
    }

    // Model management modal methods
    showModelManagement() {
        this.modelModal.style.display = 'flex';
        this.renderModelList();
        
        // Bind add model event
        const addBtn = document.getElementById('add-model-btn');
        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        
        newAddBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('new-model-name');
            const displayInput = document.getElementById('new-model-display');
            
            const name = nameInput.value.trim();
            const display = displayInput.value.trim() || name;
            
            if (!name) {
                alert('Please enter a model name');
                return;
            }
            
            // Check if it already exists
            if (this.customModels.some(model => model.name === name)) {
                alert('Model name already exists');
                return;
            }
            
            this.customModels.push({ name, display });
            this.saveCustomModels();
            this.renderModelList();
            
            // Clear input fields
            nameInput.value = '';
            displayInput.value = '';
        });
    }

    hideModelManagement() {
        this.modelModal.style.display = 'none';
    }

    renderModelList() {
        const modelList = document.getElementById('model-list');
        
        if (this.customModels.length === 0) {
            modelList.innerHTML = '<div class="empty-list">No custom models yet</div>';
            return;
        }
        
        modelList.innerHTML = this.customModels.map((model, index) => `
            <div class="item-row" data-index="${index}">
                <div class="item-info">
                    <div class="item-name">${model.display || model.name}</div>
                    <div class="item-value">${model.name}</div>
                </div>
                <div class="edit-form">
                    <input type="text" class="edit-name" value="${model.name}" placeholder="Model Name">
                    <input type="text" class="edit-display" value="${model.display || ''}" placeholder="Display Name">
                    <button class="save-btn">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
                <div class="item-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Bind edit and delete events
        modelList.addEventListener('click', (e) => {
            const row = e.target.closest('.item-row');
            const index = parseInt(row.dataset.index);
            
            if (e.target.classList.contains('edit-btn')) {
                row.classList.add('editing');
            } else if (e.target.classList.contains('cancel-btn')) {
                row.classList.remove('editing');
            } else if (e.target.classList.contains('save-btn')) {
                const name = row.querySelector('.edit-name').value.trim();
                const display = row.querySelector('.edit-display').value.trim();
                
                if (!name) {
                    alert('Please enter a model name');
                    return;
                }
                
                this.customModels[index] = { name, display: display || name };
                this.saveCustomModels();
                this.renderModelList();
            } else if (e.target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this model?')) {
                    this.customModels.splice(index, 1);
                    this.saveCustomModels();
                    this.renderModelList();
                }
            }
        });
    }
}

// Initialize after the page has loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modelComparator = new ModelComparator();
});

// Add some utility features
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter or Cmd+Enter to send quickly
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const comparator = window.modelComparator;
        if (comparator) {
            if (comparator.userSharedToggle.checked) {
                // Shared mode
                const sendBtn = document.getElementById('send-btn');
                if (!sendBtn.disabled) {
                    sendBtn.click();
                }
            } else {
                // Separate mode: check which input has focus
                const activeElement = document.activeElement;
                if (activeElement.id === 'user-prompt-a') {
                    const sendBtnA = document.getElementById('send-btn-a');
                    if (!sendBtnA.disabled) {
                        sendBtnA.click();
                    }
                } else if (activeElement.id === 'user-prompt-b') {
                    const sendBtnB = document.getElementById('send-btn-b');
                    if (!sendBtnB.disabled) {
                        sendBtnB.click();
                    }
                } else {
                    // Default to sending both
                    const sendBothBtn = document.getElementById('send-both-btn');
                    if (!sendBothBtn.disabled) {
                        sendBothBtn.click();
                    }
                }
            }
        }
    }
});

