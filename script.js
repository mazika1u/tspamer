const logEl = document.getElementById('log');
const x_super_properties = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTM0LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL2Rpc2NvcmQuY29tIiwicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjM4NDg4NywiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';

// 高度なレート制限回避システム
class RateLimitBypass {
    constructor() {
        this.tokenRotations = new Map();
        this.lastRequestTimes = new Map();
        this.failedTokens = new Set();
    }

    getOptimalToken(tokens) {
        const validTokens = tokens.filter(token => !this.failedTokens.has(token));
        if (validTokens.length === 0) return null;

        // 使用頻度が最も低いトークンを選択
        const now = Date.now();
        let selectedToken = validTokens[0];
        let minUsage = Infinity;

        for (const token of validTokens) {
            const lastUsed = this.lastRequestTimes.get(token) || 0;
            const usageCount = this.tokenRotations.get(token) || 0;
            
            if (usageCount < minUsage || (now - lastUsed) > 60000) {
                selectedToken = token;
                minUsage = usageCount;
            }
        }

        this.tokenRotations.set(selectedToken, (this.tokenRotations.get(selectedToken) || 0) + 1);
        this.lastRequestTimes.set(selectedToken, now);
        return selectedToken;
    }

    markTokenFailed(token) {
        this.failedTokens.add(token);
        setTimeout(() => this.failedTokens.delete(token), 300000); // 5分後にリセット
    }
}

const rateLimitBypass = new RateLimitBypass();

function appendLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    logEl.textContent += '\n' + timestamp + ' | ' + message;
    logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
    logEl.textContent = '';
}

let shouldStopSpam = false;
let messageContent = '';

const tokensInput = document.getElementById('tokens');
const guildInput = document.getElementById('guildId');
const channelInput = document.getElementById('channelIds');
const messageFileInput = document.getElementById('messageFile');
const randomizeCheckbox = document.getElementById('randomize');
const allmentionCheckbox = document.getElementById('allmention');
const delayInput = document.getElementById('delay');
const limitInput = document.getElementById('limit');
const mentionInput = document.getElementById('mentionIds');
const pollTitleInput = document.getElementById('pollTitle');
const pollAnswersInput = document.getElementById('pollAnswers');
const autoFillBtn = document.getElementById('autoFillChannels');
const fetchMentionsBtn = document.getElementById('fetchMentions');
const submitBtn = document.getElementById('submitBtn');
const stopBtn = document.getElementById('stopSpam');
const leaveBtn = document.getElementById('leaveBtn');
const form = document.getElementById('form');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseList(input) {
    const items = input.split(/[\s,]+/).map(item => item.trim()).filter(item => item);
    return [...new Set(items)];
}

// 高度なIPローテーションシミュレーション
function getRandomIP() {
    return `104.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// ユーザーエージェントローテーション
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// 高度なメッセージ変形システム
function transformMessage(content, options = {}) {
    let transformed = content;
    
    // ゼロ幅文字の挿入
    const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    if (options.obfuscate) {
        const insertPos = Math.floor(Math.random() * transformed.length);
        const zwChar = zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
        transformed = transformed.slice(0, insertPos) + zwChar + transformed.slice(insertPos);
    }
    
    // 文字の置換（似ている文字）
    const charReplacements = {
        'a': ['а', 'ɑ', 'а̀'], // キリル文字など
        'e': ['е', 'ё', 'è'],
        'i': ['і', 'ì', 'í'],
        'o': ['о', 'ó', 'ò'],
        'u': ['υ', 'ù', 'ú']
    };
    
    if (options.charReplace) {
        transformed = transformed.split('').map(char => {
            const replacements = charReplacements[char.toLowerCase()];
            if (replacements && Math.random() < 0.3) {
                return replacements[Math.floor(Math.random() * replacements.length)];
            }
            return char;
        }).join('');
    }
    
    // ランダムな空白の追加
    if (options.addSpaces && Math.random() < 0.2) {
        const spaces = [' ', '  ', '\u2004', '\u2005'];
        const space = spaces[Math.floor(Math.random() * spaces.length)];
        const insertPos = Math.floor(Math.random() * transformed.length);
        transformed = transformed.slice(0, insertPos) + space + transformed.slice(insertPos);
    }
    
    return transformed;
}

async function leaveGuild(token, guildId) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'x-super-properties': x_super_properties,
        'User-Agent': getRandomUserAgent(),
        'X-Forwarded-For': getRandomIP(),
        'CF-Connecting-IP': getRandomIP()
    };
    
    try {
        const response = await fetch(`https://discord.com/api/v9/users/@me/guilds/${guildId}`, {
            'method': 'DELETE',
            'headers': headers,
            'body': JSON.stringify({'lurking': false}),
            'referrerPolicy': 'no-referrer'
        });
        
        if (response.status === 204) {
            appendLog('✅ 退出成功: ' + token.slice(0, 10) + '*****');
            return true;
        } else {
            const errorData = await response.json().catch(() => ({}));
            appendLog('❌ ' + token.slice(0, 10) + '***** - 退出失敗(' + response.status + '): ' + JSON.stringify(errorData));
            return false;
        }
    } catch (error) {
        appendLog('❌ ' + token.slice(0, 10) + '***** - 退出エラー: ' + error.message);
        return false;
    }
}

// ファイル読み込み処理
messageFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            messageContent = e.target.result;
            appendLog('✅ ファイル読み込み完了: ' + file.name);
            checkFormValidity();
        };
        reader.readAsText(file);
    }
});

autoFillBtn.addEventListener('click', async () => {
    clearLog();
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    
    if (!tokens.length) return appendLog('⚠️ トークンを入力してください');
    if (!guildId) return appendLog('⚠️ サーバーIDを入力してください');
    
    const token = rateLimitBypass.getOptimalToken(tokens);
    if (!token) return appendLog('⚠️ 有効なトークンがありません');
    
    try {
        const headers = {
            'Authorization': token,
            'Content-Type': 'application/json',
            'x-super-properties': x_super_properties,
            'User-Agent': getRandomUserAgent(),
            'X-Forwarded-For': getRandomIP()
        };
        
        const response = await fetch(`https://discord.com/api/v9/guilds/${guildId}/channels`, {
            'headers': headers,
            'referrerPolicy': 'no-referrer'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(await response.json())}`);
        
        const channels = await response.json();
        const textChannels = channels.filter(channel => channel.type === 0).map(channel => channel.id);
        
        if (!textChannels.length) return appendLog('テキストチャンネルが見つかりません');
        
        channelInput.value = textChannels.join(',');
        appendLog('✅ チャンネル取得完了: ' + textChannels.length + '個のチャンネル');
    } catch (error) {
        appendLog('❌ エラー：' + error.message);
        rateLimitBypass.markTokenFailed(token);
    }
});

fetchMentionsBtn.addEventListener('click', async () => {
    clearLog();
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    const channels = parseList(channelInput.value);
    
    if (!tokens.length) return appendLog('⚠️ トークンを入力してください');
    if (!guildId) return appendLog('⚠️ サーバーIDを入力してください');
    if (!channels.length) return appendLog('⚠️ チャンネルIDを入力してください');
    
    const token = rateLimitBypass.getOptimalToken(tokens);
    if (!token) return appendLog('⚠️ 有効なトークンがありません');
    
    const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    
    ws.onopen = () => {
        ws.send(JSON.stringify({
            'op': 2,
            'd': {
                'token': token,
                'properties': {
                    'os': 'Windows',
                    'browser': 'Chrome',
                    'device': '',
                    'system_locale': 'en-US',
                    'browser_user_agent': getRandomUserAgent(),
                    'browser_version': '134.0.0.0',
                    'os_version': '10',
                    'referrer': 'https://discord.com',
                    'referring_domain': 'discord.com',
                    'referrer_current': '',
                    'referring_domain_current': '',
                    'release_channel': 'stable',
                    'client_build_number': 384887,
                    'client_event_source': null
                },
                'intents': 1 << 12
            }
        }));
    };
    
    ws.onmessage = event => {
        const data = JSON.parse(event.data);
        
        if (data.op === 0 && data.t === 'READY') {
            ws.send(JSON.stringify({
                'op': 14,
                'd': {
                    'guild_id': guildId,
                    'typing': false,
                    'activities': false,
                    'threads': true,
                    'channels': {[channels[0]]: [[0, 0]]}
                }
            }));
        }
        
        if (data.t === 'GUILD_MEMBER_LIST_UPDATE') {
            const members = data.d.ops[0].items.map(item => item.member).filter(member => member);
            const userIds = members.map(member => member.user.id);
            
            if (userIds.length) {
                mentionInput.value = userIds.join(',');
                appendLog('✅ メンション取得完了: ' + userIds.length + '人のユーザー');
            } else {
                appendLog('メンション対象のユーザーが見つかりません');
            }
            ws.close();
        }
    };
    
    ws.onerror = (error) => {
        appendLog('❌ WebSocketエラー: ' + error.message);
        ws.close();
    };
    
    ws.onclose = () => {
        appendLog('ℹ️ WebSocket接続終了');
    };
});

async function authenticateOnly(token) {
    return new Promise(resolve => {
        const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
        let authenticated = false;
        
        ws.onopen = () => {
            ws.send(JSON.stringify({
                'op': 2,
                'd': {
                    'token': token,
                    'properties': {
                        'os': 'Windows',
                        'browser': 'Chrome',
                        'device': '',
                        'system_locale': 'en-US',
                        'browser_user_agent': getRandomUserAgent(),
                        'browser_version': '134.0.0.0',
                        'os_version': '10'
                    },
                    'intents': 0
                }
            }));
        };
        
        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.t === 'READY') {
                authenticated = true;
                appendLog('✅ 認証完了: ' + token.slice(0, 10) + '*****');
                ws.close();
                resolve(true);
            } else if (data.t === 'INVALID_SESSION') {
                appendLog('❌ 認証失敗: ' + token.slice(0, 10) + '*****');
                ws.close();
                resolve(false);
            }
        };
        
        ws.onerror = () => {
            appendLog('❌ WebSocket エラー: ' + token.slice(0, 10) + '*****');
            ws.close();
            resolve(false);
        };
        
        ws.onclose = () => {
            if (!authenticated) {
                resolve(false);
            }
        };
        
        // タイムアウト処理
        setTimeout(() => {
            if (!authenticated) {
                ws.close();
                resolve(false);
            }
        }, 10000);
    });
}

// 高度なメッセージ送信関数（Wick対策）
async function sendMessageAdvanced(token, channelId, message, options = {}) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'x-super-properties': x_super_properties,
        'User-Agent': getRandomUserAgent(),
        'X-Forwarded-For': getRandomIP(),
        'CF-Connecting-IP': getRandomIP(),
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://discord.com',
        'Referer': `https://discord.com/channels/${options.guildId || '@me'}/${channelId}`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
    };
    
    let payload = {'content': message || ''};
    
    // メッセージ変形を適用
    if (options.obfuscate) {
        payload.content = transformMessage(payload.content, {
            obfuscate: true,
            charReplace: true,
            addSpaces: true
        });
    }
    
    if (options.randomize) {
        payload.content += '\n' + Math.random().toString(36).substring(2, 15);
    }
    
    if (options.allmention) {
        payload.content = '@everyone\n' + payload.content;
    }
    
    if (options.randomMentions && options.randomMentions.length > 0) {
        const randomMention = options.randomMentions[Math.floor(Math.random() * options.randomMentions.length)];
        payload.content = '<@' + randomMention + '>\n' + payload.content;
    }
    
    if (options.pollTitle && options.pollAnswers) {
        payload.poll = {
            'question': {'text': options.pollTitle},
            'answers': options.pollAnswers.map(answer => ({'poll_media': {'text': answer.trim()}})),
            'allow_multiselect': false,
            'duration': 1,
            'layout_type': 1
        };
    }
    
    // ランダムな遅延を追加（人間らしい挙動）
    if (options.randomDelay) {
        await sleep(Math.random() * 2000 + 1000);
    }
    
    try {
        const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify(payload),
            'referrerPolicy': 'no-referrer',
            'mode': 'cors',
            'credentials': 'include'
        });
        
        return response;
    } catch (error) {
        throw new Error(`Network error: ${error.message}`);
    }
}

async function sendMessageWithRetry(token, channelId, message, options = {}, maxRetries = 8, baseDelay = 2000) {
    let retryCount = 0;
    
    while (retryCount < maxRetries && !shouldStopSpam) {
        try {
            const response = await sendMessageAdvanced(token, channelId, message, {
                ...options,
                randomDelay: retryCount > 0,
                obfuscate: retryCount > 2 // リトライ回数が多いほど変形を強化
            });
            
            if (response.ok) {
                appendLog('✅ ' + token.slice(0, 10) + '***** - メッセージ送信成功');
                return true;
            } else {
                if (response.status === 429) {
                    const data = await response.json();
                    const delay = (data.retry_after || 1) * 1000;
                    const jitter = Math.random() * 1000;
                    appendLog('⏳  ' + token.slice(0, 10) + '***** - レート制限: ' + (delay/1000).toFixed(1) + 's');
                    await sleep(delay + jitter);
                    retryCount++;
                } else if (response.status === 400 || response.status === 403) {
                    const data = await response.json();
                    appendLog('❌ ' + token.slice(0, 10) + '***** - 送信エラー(' + response.status + '): ' + (JSON.stringify(data) || '詳細不明'));
                    
                    // 認証チェック
                    if (response.status === 403) {
                        const authTest = await authenticateOnly(token);
                        if (!authTest) {
                            rateLimitBypass.markTokenFailed(token);
                            return false;
                        }
                    }
                    
                    // 一時的なエラーの場合はリトライ
                    if (retryCount < 3) {
                        retryCount++;
                        await sleep(baseDelay * Math.pow(2, retryCount));
                    } else {
                        return false;
                    }
                } else {
                    const data = await response.json();
                    appendLog('⚠️ ' + token.slice(0, 10) + '***** - 一時的エラー(' + response.status + '): ' + (JSON.stringify(data) || '詳細不明'));
                    
                    if (retryCount < maxRetries - 1) {
                        retryCount++;
                        await sleep(baseDelay * Math.pow(2, retryCount));
                    } else {
                        return false;
                    }
                }
            }
        } catch (error) {
            appendLog('❌ ' + token.slice(0, 10) + '***** - ネットワークエラー: ' + error.message + ' | 再試行中...');
            await sleep(baseDelay * Math.pow(2, retryCount));
            retryCount++;
        }
    }
    
    if (retryCount >= maxRetries) {
        appendLog('❌ ' + token.slice(0, 10) + '***** - 最大リトライ回数に達しました');
        rateLimitBypass.markTokenFailed(token);
    }
    
    return false;
}

function checkFormValidity() {
    const hasTokens = tokensInput.value.trim();
    const hasGuildId = guildInput.value.trim();
    const hasMessage = messageContent.trim();
    submitBtn.disabled = !(hasTokens && hasGuildId && hasMessage);
}

tokensInput.addEventListener('input', checkFormValidity);
guildInput.addEventListener('input', checkFormValidity);
messageFileInput.addEventListener('change', checkFormValidity);
checkFormValidity();

form.addEventListener('submit', async event => {
    event.preventDefault();
    
    if (!messageContent) {
        appendLog('⚠️ メッセージファイルを選択してください');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = '実行中...';
    shouldStopSpam = false;
    stopBtn.disabled = false;
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    const channels = parseList(channelInput.value);
    const randomize = randomizeCheckbox.checked;
    const allmention = allmentionCheckbox.checked;
    const delay = parseFloat(delayInput.value) || 0;
    const limit = limitInput.value.trim() ? parseInt(limitInput.value) : Infinity;
    const mentions = mentionInput.value.trim() ? parseList(mentionInput.value) : null;
    const pollTitle = pollTitleInput.value.trim() || null;
    const pollAnswers = pollAnswersInput.value.trim() ? parseList(pollAnswersInput.value) : null;
    
    let messageCount = 0;
    let activeTokens = new Set(tokens);
    
    appendLog(`🚀 開始: ${tokens.length}トークン, ${channels.length}チャンネル`);
    
    // 各トークンで並列実行
    const sendPromises = tokens.map(token => {
        return async () => {
            let channelIndex = 0;
            let tokenMessageCount = 0;
            
            while (!shouldStopSpam && messageCount < limit && activeTokens.has(token)) {
                if (channelIndex >= channels.length) channelIndex = 0;
                const channelId = channels[channelIndex];
                channelIndex++;
                
                const success = await sendMessageWithRetry(
                    token, 
                    channelId, 
                    messageContent,
                    {
                        'randomize': randomize,
                        'randomMentions': mentions,
                        'pollTitle': pollTitle,
                        'pollAnswers': pollAnswers,
                        'allmention': allmention,
                        'guildId': guildId
                    }
                );
                
                if (success) {
                    messageCount++;
                    tokenMessageCount++;
                } else {
                    // トークンが失敗した場合は非アクティブ化
                    activeTokens.delete(token);
                    appendLog('⚠️ トークン停止: ' + token.slice(0, 10) + '*****');
                    break;
                }
                
                if (messageCount >= limit) {
                    appendLog('✅ 指定数に達しました: ' + messageCount + 'メッセージ');
                    break;
                }
                
                // 動的遅延調整
                if (delay > 0) {
                    const jitter = Math.random() * delay * 0.5;
                    await sleep(delay * 1000 + jitter);
                }
                
                // 定期的なトークンローテーション
                if (tokenMessageCount % 5 === 0) {
                    await sleep(1000 + Math.random() * 2000);
                }
            }
            
            appendLog('ℹ️ トークン完了: ' + token.slice(0, 10) + '***** - ' + tokenMessageCount + 'メッセージ');
        };
    });
    
    // 並列実行の制御
    const BATCH_SIZE = 3; // 同時実行トークン数
    for (let i = 0; i < sendPromises.length; i += BATCH_SIZE) {
        if (shouldStopSpam) break;
        
        const batch = sendPromises.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(send => send()));
        
        // バッチ間の休憩
        if (i + BATCH_SIZE < sendPromises.length && !shouldStopSpam) {
            await sleep(5000 + Math.random() * 5000);
        }
    }
    
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    stopBtn.disabled = true;
    submitBtn.textContent = '実行';
    appendLog('✅ 全トークンの処理が完了しました');
});

stopBtn.addEventListener('click', () => {
    shouldStopSpam = true;
    appendLog('🛑 送信を停止します...');
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '実行';
});

leaveBtn.addEventListener('click', async () => {
    shouldStopSpam = true;
    stopBtn.disabled = true;
    appendLog('🛑 送信を停止し、退出処理を開始します...');
    
    const tokens = parseList(tokensInput.value);
    const guildId = guildInput.value.trim();
    
    if (!tokens.length) return appendLog('⚠️ トークンを入力してください');
    if (!guildId) return appendLog('⚠️ サーバーIDを入力してください');
    
    appendLog(`🚪 ${tokens.length}トークンで退出処理を開始...`);
    
    // 退出処理も並列実行
    const leavePromises = tokens.map(token => leaveGuild(token, guildId));
    const results = await Promise.all(leavePromises);
    
    const successCount = results.filter(result => result).length;
    appendLog(`✅ 退出処理完了: ${successCount}/${tokens.length} 成功`);
    
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = '実行';
});
