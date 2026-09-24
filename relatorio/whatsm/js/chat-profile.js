// ============================================
// SCRIPT PARA CARREGAR FOTO DE PERFIL NO CHAT
// UTILIZANDO IMAGEM DO LOCALSTORAGE (SEM REQUISIÇÃO DUPLICADA)
// ============================================

// Gerar avatar padrão
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

// Função principal para carregar foto usando cache
function loadChatProfilePicture() {
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
        
        // AGORA: Buscar APENAS os elementos existentes, NÃO criar novos
        
        // Primeiro, remover qualquer elemento criado anteriormente pelo script
        const previousDynamicElement = document.getElementById('chatProfileImage');
        if (previousDynamicElement) {
            console.log('🗑️ Removendo elemento dinâmico anterior');
            previousDynamicElement.remove();
        }
        
        // 1. Tentar encontrar o ELEMENTO PRINCIPAL que você mostrou
        const mainProfileImage = document.querySelector('div.flex.items-center.gap-2 span.relative.flex.shrink-0.overflow-hidden.rounded-full img#profileImage');
        
        if (mainProfileImage) {
            console.log('✅ Elemento principal encontrado, atualizando...');
            mainProfileImage.src = finalImageUrl;
            mainProfileImage.style.display = 'block';
            console.log('✅ Foto atualizada no elemento principal');
            return; // Já encontrou e atualizou, pode parar aqui
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
            console.log('✅ SVG padrão encontrado, substituindo...');
            
            // Criar elemento de imagem apenas se for SVG
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
        
        // 4. Tentar outros seletores comuns (sem criar novos elementos)
        const alternativeSelectors = [
            '[data-profile-image] img',
            '.profile-avatar img',
            '.avatar-image img',
            'img[alt*="perfil"]',
            'img[alt*="profile"]',
            '#profileImageContainer img',
            '.profile-picture img',
            '.profile-img'
        ];
        
        let elementFound = false;
        
        for (const selector of alternativeSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('✅ Elemento encontrado:', selector);
                element.src = finalImageUrl;
                element.style.display = 'block';
                elementFound = true;
                console.log('✅ Foto atualizada no elemento existente');
                break;
            }
        }
        
        if (!elementFound) {
            console.log('⚠️ Nenhum elemento de imagem encontrado - NÃO criando novo elemento');
            // NÃO criar elemento dinâmico - apenas logar
        }
        
        console.log('✅ Foto do chat carregada com sucesso do cache');
        
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
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Função para inicializar com verificação de cache
function initializeChatProfile() {
    console.log('🚀 Inicializando script de foto do chat...');
    
    // Verificar se temos cache válido
    const hasValidCache = () => {
        const imageUrl = localStorage.getItem('contactProfileImage');
        const timestamp = localStorage.getItem('contactImageTimestamp');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        return imageUrl && imageUrl !== 'null' && 
               timestamp && (now - timestamp < oneHour);
    };
    
    if (hasValidCache()) {
        console.log('💾 Cache válido encontrado, carregando foto...');
        
        // Aguardar um pouco para garantir que o DOM está pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(loadChatProfilePicture, 1000);
            });
        } else {
            setTimeout(loadChatProfilePicture, 1000);
        }
    } else {
        console.log('⏳ Cache não encontrado ou expirado');
        
        // Tentar após o DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(loadChatProfilePicture, 1500);
            });
        } else {
            setTimeout(loadChatProfilePicture, 1500);
        }
    }
}

// Executar inicialização
initializeChatProfile();

// Tentar novamente após 2.5 segundos (para garantir que elementos foram carregados)
setTimeout(loadChatProfilePicture, 2500);

// Expor função globalmente
window.loadChatProfilePicture = loadChatProfilePicture;

console.log('✅ Script de foto de perfil otimizado carregado!');