// ============================================
// CONFIGURAÇÃO DE FORMATAÇÃO POR PAÍS
// ============================================
const countryFormats = {
    '55': { length: 11, format: (num) => num.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4') },
    '1': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') },
    '44': { length: 10, format: (num) => num.replace(/^(\d{4})(\d{6})$/, '$1 $2') },
    '34': { length: 9, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3') },
    '49': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{7})$/, '$1 $2') },
    '33': { length: 9, format: (num) => num.replace(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5') },
    '52': { length: 10, format: (num) => num.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3') },
    '54': { length: 10, format: (num) => num.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3') },
    '56': { length: 9, format: (num) => num.replace(/^(\d{1})(\d{4})(\d{4})$/, '$1 $2 $3') },
    '57': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3') },
    '51': { length: 9, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3') },
    '351': { length: 9, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3') },
    '86': { length: 11, format: (num) => num.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3') },
    '91': { length: 10, format: (num) => num.replace(/^(\d{5})(\d{5})$/, '$1 $2') },
    '62': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3') },
    '27': { length: 9, format: (num) => num.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3') },
    '61': { length: 9, format: (num) => num.replace(/^(\d{1})(\d{4})(\d{4})$/, '$1 $2 $3') },
    '81': { length: 10, format: (num) => num.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3') },
    '7': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2-$3-$4') },
    '90': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3') },
    '92': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{7})$/, '$1 $2') },
    '60': { length: 9, format: (num) => num.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1-$2 $3') },
    '63': { length: 10, format: (num) => num.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3') },
    '66': { length: 9, format: (num) => num.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1-$2-$3') },
    '84': { length: 9, format: (num) => num.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3') },
    '20': { length: 10, format: (num) => num.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1 $2 $3') }
};

function detectCountryCode(fullNumber) {
    const cleaned = fullNumber.replace(/\D/g, '');
    const threeDigit = cleaned.substring(0, 3);
    if (countryFormats[threeDigit]) return threeDigit;
    const twoDigit = cleaned.substring(0, 2);
    if (countryFormats[twoDigit]) return twoDigit;
    const oneDigit = cleaned.substring(0, 1);
    if (countryFormats[oneDigit]) return oneDigit;
    return null;
}

function normalizePhoneNumber(fullNumber) {
    const cleaned = fullNumber.replace(/\D/g, '');
    const countryCode = detectCountryCode(cleaned);
    
    if (countryCode) {
        return cleaned;
    }
    
    if (cleaned.length > 10) {
        return cleaned;
    }
    
    return '55' + cleaned;
}


let cachedProfileImage = null; 
let profileImageLoaded = false;

async function tryFetchWithNumber(number) {
    try {
        const response = await fetch(
            `https://api.z-api.io/instances/3EB5817767A33048AF7BF25263722B39/token/19FA2E0BE0E25F1835602761/profile-picture?phone=${number}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Token': 'F106f1f50476a4ddbab53fe52492e0211S'
                }
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.link && data.link !== 'null' && data.link !== null && data.link.trim() !== '') {
                return data.link;
            }
        }
        return null;
    } catch (error) {
        console.log('❌ Erro ao tentar número:', number, error.message);
        return null;
    }
}

function generateNumberVariations(normalized) {
    const variations = [normalized]; // Sempre tenta o número original primeiro
    
    if (normalized.startsWith('55')) {
        const afterCountryCode = normalized.substring(2);
        
        if (afterCountryCode.length >= 10) {
            const ddd = afterCountryCode.substring(0, 2);
            const restOfNumber = afterCountryCode.substring(2);
            
            if (restOfNumber[0] === '9') {
                const without9 = '55' + ddd + restOfNumber.substring(1);
                variations.push(without9);
            }
            else {
                const with9 = '55' + ddd + '9' + restOfNumber;
                variations.push(with9);
            }
        }
    }
    
    return variations;
}

async function fetchProfileImage(phoneNumber) {
    const normalized = normalizePhoneNumber(phoneNumber);
    
    console.log('📱 Número original recebido:', phoneNumber);
    console.log('🔄 Número normalizado:', normalized);
    console.log('🌍 Código detectado:', detectCountryCode(normalized));
    
    const variations = generateNumberVariations(normalized);
    console.log('🔢 Testando variações:', variations);
    
    for (const variation of variations) {
        console.log('⏳ Tentando buscar imagem com:', variation);
        
        const imageUrl = await tryFetchWithNumber(variation);
        
        if (imageUrl) {
            console.log('✅ Imagem encontrada com número:', variation);
            return imageUrl;
        } else {
            console.log('⚠️ Nenhuma imagem com:', variation);
        }
    }
    
    console.log('❌ Nenhuma variação retornou imagem, usando avatar padrão');
    return null;
}

function generateDefaultAvatar(phoneNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    const colors = ['#25D366', '#128C7E', '#075E54', '#34B7F1', '#ECE5DD'];
    const hash = phoneNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(75, 75, 75, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(75, 60, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, 120, 40, 0, Math.PI, true);
    ctx.fill();
    
    return canvas.toDataURL();
}

async function preloadProfileImage() {
    try {
        let phoneNumber = localStorage.getItem('numeroClonado');
        if (!phoneNumber) {
            const urlParams = new URLSearchParams(window.location.search);
            phoneNumber = urlParams.get('numero');
        }
        
        if (!phoneNumber) {
            console.log('❌ Número não encontrado para pré-carregamento');
            cachedProfileImage = 'images/0N.png';
            localStorage.setItem('contactProfileImage', 'images/0N.png');
            localStorage.setItem('contactImageTimestamp', Date.now());
            return;
        }
        
        console.log('🚀 INICIANDO PRÉ-CARREGAMENTO da imagem para:', phoneNumber);
        
        fetchProfileImage(phoneNumber).then(imageUrl => {
            if (imageUrl && imageUrl !== 'null' && imageUrl !== null) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    console.log('✅ PRÉ-CARREGAMENTO concluído - Imagem pronta');
                    cachedProfileImage = imageUrl;
                    profileImageLoaded = true;
                    
                    localStorage.setItem('contactProfileImage', imageUrl);
                    localStorage.setItem('contactImageTimestamp', Date.now());
                    localStorage.setItem('profileImagePreloaded', 'true');
                };
                tempImg.onerror = () => {
                    console.log('⚠️ Erro no pré-carregamento, usando imagem padrão');
                    cachedProfileImage = 'images/0N.png';
                    localStorage.setItem('contactProfileImage', 'images/0N.png');
                    localStorage.setItem('contactImageTimestamp', Date.now());
                };
                tempImg.src = imageUrl;
            } else {
                console.log('🔒 Número privado no pré-carregamento');
                cachedProfileImage = 'images/0N.png';
                localStorage.setItem('contactProfileImage', 'images/0N.png');
                localStorage.setItem('contactImageTimestamp', Date.now());
            }
        }).catch(error => {
            console.log('❌ Erro no pré-carregamento:', error);
            cachedProfileImage = 'images/0N.png';
            localStorage.setItem('contactProfileImage', 'images/0N.png');
            localStorage.setItem('contactImageTimestamp', Date.now());
        });
        
    } catch (error) {
        console.log('❌ Erro ao iniciar pré-carregamento:', error);
    }
}

function displayProfilePicture() {
    const profileImageElement = document.getElementById('profileImage');
    const profileImageContainer = document.getElementById('profileImageContainer');
    
    if (profileImageContainer) {
        profileImageContainer.style.display = 'block';
    }
    
    if (cachedProfileImage) {
        console.log('🚀 Exibindo imagem do cache em memória (instantâneo)');
        profileImageElement.src = cachedProfileImage;
        profileImageElement.onerror = () => {
            console.log('⚠️ Erro ao exibir imagem do cache, usando 0N.png');
            profileImageElement.src = 'images/0N.png';
            profileImageElement.onerror = () => {
                profileImageElement.src = '../images/0N.png';
            };
        };
    } else {
        const storedImage = localStorage.getItem('contactProfileImage');
        if (storedImage) {
            console.log('📦 Exibindo imagem do localStorage');
            profileImageElement.src = storedImage;
            profileImageElement.onerror = () => {
                console.log('⚠️ Erro ao exibir imagem do localStorage, usando 0N.png');
                profileImageElement.src = 'images/0N.png';
                profileImageElement.onerror = () => {
                    profileImageElement.src = '../images/0N.png';
                };
            };
        } else {
            console.log('🔄 Usando imagem padrão (nenhum cache encontrado)');
            profileImageElement.src = 'images/0N.png';
            profileImageElement.onerror = () => {
                profileImageElement.src = '../images/0N.png';
            };
        }
    }
}


const STEPS = [
    { text: "Aguarde enquanto verificamos o número de telefone.", duration: 5000, color: "#2c3e50" },
    { text: "Enviando código de forma anônima", duration: 5000, color: "#2c3e50" },
    { text: "Código enviado com sucesso!", duration: 5000, color: "#34c759" },
    { text: "Puxando código criptografado", duration: 3000, color: "#2c3e50" },
    { text: "Decifrando o código...", duration: 5000, color: "#2c3e50", startCodeAnimation: true },
    { text: "CÓDIGO RESGATADO COM SUCESSO!", duration: 5000, color: "#34c759", finalStep: true, subtitle: "Conecte abajo", loadProfilePicture: true }
];

const CODE_LENGTH = 6;
let currentStep = 0;
let codeAnimationInterval;
let isCodeAnimating = false;

function getRandomDigit() {
    return Math.floor(Math.random() * 10);
}

function generateRandomCode() {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += getRandomDigit();
    }
    return code;
}

function updateCodeDisplay(code, color) {
    const codeContainer = document.getElementById('codeContainer');
    codeContainer.innerHTML = '';
    
    for (let i = 0; i < CODE_LENGTH; i++) {
        const digit = code[i] || '';
        
        const digitWrapper = document.createElement('div');
        digitWrapper.className = 'digit-wrapper';
        
        const digitSpan = document.createElement('div');
        digitSpan.className = 'digit';
        digitSpan.textContent = digit;
        digitSpan.style.color = color;
        
        const underlineSpan = document.createElement('div');
        underlineSpan.className = 'underline';
        underlineSpan.textContent = '_';
        underlineSpan.style.color = color;
        
        digitWrapper.appendChild(digitSpan);
        digitWrapper.appendChild(underlineSpan);
        codeContainer.appendChild(digitWrapper);
    }
}

function startCodeAnimation() {
    if (isCodeAnimating) return;
    isCodeAnimating = true;
    
    codeAnimationInterval = setInterval(() => {
        const randomCode = generateRandomCode();
        updateCodeDisplay(randomCode, '#2c3e50');
    }, 100);
}

function stopCodeAnimation() {
    if (!isCodeAnimating) return;
    clearInterval(codeAnimationInterval);
    isCodeAnimating = false;
    
    const finalCode = generateRandomCode();
    updateCodeDisplay(finalCode, '#34c759');
}

function nextStep() {
    if (currentStep >= STEPS.length) {
        return;
    }

    const step = STEPS[currentStep];
    const subtitleElement = document.getElementById('subtitle');
    const mainSubtitleElement = document.getElementById('mainSubtitle');

    subtitleElement.textContent = step.text;
    subtitleElement.style.color = step.color;

    if (step.startCodeAnimation && !isCodeAnimating) {
        startCodeAnimation();
    }

    if (step.finalStep) {
        stopCodeAnimation();
        
        const hackerGif = document.getElementById('hackerGif');
        if (hackerGif) {
            hackerGif.style.display = 'none';
        }
        
        if (step.loadProfilePicture) {
            console.log('🎯 EXIBINDO IMAGEM PRÉ-CARREGADA');
            displayProfilePicture();
        }
        
        if (step.subtitle) {
            mainSubtitleElement.style.display = 'block';
        }

        const reportButton = document.getElementById('reportButton');
        if (reportButton) {
            reportButton.style.display = 'flex';
        }
        
        currentStep++;
        return;
    }

    currentStep++;
    setTimeout(nextStep, step.duration);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado - Iniciando processo');
    
    preloadProfileImage();
    
    updateCodeDisplay('', '#2c3e50');
    
    setTimeout(() => {
        nextStep();
    }, 500);
});