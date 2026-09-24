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

// Gerar avatar padrão personalizado
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

// ============================================
// FUNÇÃO PRINCIPAL - CARREGAR FOTO DO CACHE
// ============================================
function loadProfilePicture() {
    try {
        // Buscar número do localStorage ou URL
        let phoneNumber = localStorage.getItem('numeroClonado');
        if (!phoneNumber) {
            const urlParams = new URLSearchParams(window.location.search);
            phoneNumber = urlParams.get('numero');
        }
        
        if (!phoneNumber) {
            console.log('❌ Número não encontrado');
            return;
        }
        
        console.log('📱 Carregando foto do cache para:', phoneNumber);
        
        // 1. Obtém a imagem do localStorage (já PRÉ-CARREGADA pela página animation.js)
        const imageUrl = localStorage.getItem('contactProfileImage');
        const timestamp = localStorage.getItem('contactImageTimestamp');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // Cache de 1 hora
        
        console.log('💾 Imagem do cache:', imageUrl ? 'Encontrada' : 'Não encontrada');
        
        // Definir a URL da imagem a ser usada
        let finalImageUrl = null;
        
        if (imageUrl && imageUrl !== 'null' && imageUrl !== '' && 
            timestamp && (now - timestamp < oneHour)) {
            // Usa imagem do cache (válida por 1 hora)
            finalImageUrl = imageUrl;
            console.log('✅ Usando imagem PRÉ-CARREGADA do cache');
        } else {
            // Cache expirado ou não encontrado, gera avatar
            finalImageUrl = generateDefaultAvatar(phoneNumber);
            console.log('⏳ Cache expirado, gerando avatar padrão');
            
            // Limpa o cache expirado
            if (timestamp && (now - timestamp >= oneHour)) {
                localStorage.removeItem('contactProfileImage');
                localStorage.removeItem('contactImageTimestamp');
                localStorage.removeItem('profileImagePreloaded');
                console.log('🗑️ Cache expirado removido');
            }
        }
        
        // REMOVER: Não criar elementos dinâmicos se não encontrar
        
        // Primeiro, remover qualquer elemento criado anteriormente
        const previousDynamicContainer = document.getElementById('profileImageContainer');
        if (previousDynamicContainer && previousDynamicContainer.parentNode) {
            console.log('🗑️ Removendo container dinâmico anterior');
            previousDynamicContainer.remove();
        }
        
        // 1. Tentar encontrar o ELEMENTO PRINCIPAL pelo seletor específico
        const mainProfileImage = document.querySelector('div.flex.items-center.gap-2 span.relative.flex.shrink-0.overflow-hidden.rounded-full img#profileImage');
        
        if (mainProfileImage) {
            console.log('✅ Elemento principal encontrado, atualizando...');
            mainProfileImage.src = finalImageUrl;
            mainProfileImage.style.display = 'block';
            console.log('✅ Foto atualizada no elemento principal');
            return;
        }
        
        // 2. Tentar encontrar por ID direto (segunda opção)
        const profileImageById = document.getElementById('profileImage');
        if (profileImageById) {
            console.log('✅ Elemento encontrado por ID, atualizando...');
            profileImageById.src = finalImageUrl;
            profileImageById.style.display = 'block';
            console.log('✅ Foto atualizada no elemento por ID');
            return;
        }
        
        // 3. Tentar encontrar SVG padrão do WhatsApp para substituir
        const svgElement = document.querySelector('svg[viewBox="0 0 212 212"]');
        if (svgElement) {
            console.log('🔄 SVG padrão encontrado, substituindo...');
            
            const imgElement = document.createElement('img');
            imgElement.id = 'profileImage';
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.borderRadius = '50%';
            imgElement.style.objectFit = 'cover';
            imgElement.src = finalImageUrl;
            
            svgElement.parentNode.replaceChild(imgElement, svgElement);
            console.log('✅ SVG substituído por imagem');
            return;
        }
        
        // 4. Tentar outros seletores comuns
        const selectors = [
            '#profileImageContainer img',
            '[data-profile-image]',
            '.profile-avatar img',
            '.avatar-image',
            'img.profile-image',
            '.profile-pic img',
            '.user-avatar img'
        ];
        
        let elementFound = false;
        
        // Tentar encontrar o elemento da imagem existente
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('✅ Elemento encontrado:', selector);
                
                // Se for um container, procurar a imagem dentro
                if (!element.tagName || element.tagName.toLowerCase() !== 'img') {
                    const imgInside = element.querySelector('img');
                    if (imgInside) {
                        imgInside.src = finalImageUrl;
                        imgInside.style.display = 'block';
                        console.log('✅ Foto atualizada na imagem interna');
                    } else {
                        // Se for um elemento que pode ter background image
                        element.style.backgroundImage = `url(${finalImageUrl})`;
                        element.style.backgroundSize = 'cover';
                        element.style.backgroundPosition = 'center';
                        console.log('✅ Foto aplicada como background');
                    }
                } else {
                    // É uma imagem direta
                    element.src = finalImageUrl;
                    element.style.display = 'block';
                    console.log('✅ Foto atualizada na imagem direta');
                }
                
                elementFound = true;
                break;
            }
        }
        
        if (!elementFound) {
            console.log('⚠️ Nenhum elemento de perfil encontrado no DOM - NÃO criando novo');
            // NÃO criar elemento dinâmico - apenas logar
        }
        
        console.log('✅ Foto de perfil carregada com sucesso do cache');
        
    } catch (error) {
        console.log('❌ Erro ao carregar foto do cache:', error);
        
        // Fallback apenas para SVG (não cria novos elementos)
        const svgElement = document.querySelector('svg[viewBox="0 0 212 212"]');
        
        if (svgElement) {
            const phoneNumber = localStorage.getItem('numeroClonado') || '';
            const imgElement = document.createElement('img');
            imgElement.src = generateDefaultAvatar(phoneNumber);
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.borderRadius = '50%';
            imgElement.style.objectFit = 'cover';
            svgElement.parentNode.replaceChild(imgElement, svgElement);
        }
    }
}

// ============================================
// ANIMAÇÃO DE CÓDIGO (MANTIDA)
// ============================================
const STEPS = [
    { text: "Espere mientras verificamos el número de teléfono.", duration: 5000, color: "#2c3e50" },
    { text: "Enviando código de forma anónima...", duration: 5000, color: "#2c3e50" },
    { text: "Código enviado con éxito", duration: 5000, color: "#34c759" },
    { text: "Recuperando código Encriptado", duration: 3000, color: "#2c3e50" },
    { text: "Desencriptando Código...", duration: 5000, color: "#2c3e50", startCodeAnimation: true },
    { text: "CÓDIGO RECUPERADO CON ÉXITO", duration: 5000, color: "#34c759", finalStep: true, subtitle: "Conecte abajo", loadProfilePicture: true }
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
    if (!codeContainer) return;
    
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

    if (subtitleElement) {
        subtitleElement.textContent = step.text;
        subtitleElement.style.color = step.color;
    }

    if (step.startCodeAnimation && !isCodeAnimating) {
        startCodeAnimation();
    }

    if (step.finalStep) {
        stopCodeAnimation();
        
        const hackerGif = document.getElementById('hackerGif');
        if (hackerGif) {
            hackerGif.style.display = 'none';
        }
        
        // Carrega a foto de perfil DO CACHE (sem requisição)
        if (step.loadProfilePicture) {
            console.log('🚀 Carregando foto do cache...');
            loadProfilePicture();
        }
        
        if (step.subtitle && mainSubtitleElement) {
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

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 dwpp.js otimizado carregado');
    updateCodeDisplay('', '#2c3e50');
    nextStep();
    
    // Tentar carregar foto do cache também (para páginas que não usam animação)
    setTimeout(() => {
        loadProfilePicture();
    }, 1000);
});

// Expor função globalmente para chamadas externas
window.loadProfilePicture = loadProfilePicture;