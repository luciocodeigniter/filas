/**
 * ============================================
 * SISTEMA DE PAINEL DE SENHAS - HOSPITAL
 * Script Principal - Funções Compartilhadas
 * ============================================
 */

// ============= API HELPERS =============

async function apiRequest(url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : null
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Erro na requisição');
        }

        return result;

    } catch (error) {
        console.error('Erro API:', error);
        exibirNotificacao(error.message || 'Erro inesperado', 'danger');
        throw error;
    }
}

// ============= CONFIGURAÇÕES GLOBAIS =============
const CONFIG = {
    // apiUrl: 'api/', // URL base da API PHP
    atualizacaoAutomatica: 5000, // 5 segundos
    tempoOverlayChamada: 5000 // 5 segundos
};

// ============= FUNÇÕES UTILITÁRIAS =============

function formatarDataHora(data) {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR');
}

function formatarHora(data) {
    if (!data) return '';
    return new Date(data).toLocaleTimeString('pt-BR');
}

function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
}

function calcularTempoDecorrido(dataInicio) {
    const diff = Math.floor((new Date() - new Date(dataInicio)) / 1000 / 60);
    return diff;
}

function formatarTempoEspera(minutos) {
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
}

function getClasseClassificacao(cor) {
    const mapa = {
        'vermelho': 'badge-vermelho',
        'laranja': 'badge-laranja',
        'amarelo': 'badge-amarelo',
        'verde': 'badge-verde',
        'azul': 'badge-azul'
    };
    return mapa[cor] || 'badge-secondary';
}

function exibirNotificacao(mensagem, tipo = 'success') {
    const toast = $('<div>')
        .addClass(`alert alert-${tipo} alert-dismissible fade show position-fixed`)
        .css({ top: '20px', right: '20px', 'z-index': '9999', 'min-width': '300px' })
        .html(`${mensagem}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`);

    $('body').append(toast);
    setTimeout(() => toast.fadeOut(() => toast.remove()), 5000);
}

// ============= ÁUDIO =============

let audioContext = null;

function inicializarAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('[Audio] AudioContext criado. Estado:', audioContext.state);
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('[Audio] AudioContext resumido. Estado:', audioContext.state);
        });
    }
}

function reproduzirSom() {
    try {
        const audio = document.getElementById('audioChamada');

        if (!audio) {
            console.warn('[Audio] Elemento #audioChamada não encontrado no HTML.');
            return;
        }

        audio.currentTime = 0; // Reinicia caso já esteja tocando
        audio.play()
            .then(() => console.log('[Audio] Som reproduzido com sucesso.'))
            .catch(e => console.error('[Audio] Erro ao reproduzir:', e));

    } catch (e) {
        console.error('[Audio] Erro inesperado:', e);
    }
}

function imprimirSenha() {
    window.print();
}

// ============= RELÓGIO =============

function atualizarRelogio() {
    const agora = new Date();
    $('#relogio, #relogioPainel').text(agora.toLocaleTimeString('pt-BR'));
    $('#dataPainel').text(agora.toLocaleDateString('pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
}

setInterval(atualizarRelogio, 1000);

$(document).ready(function () {
    if ($('#cpfPaciente').length) $('#cpfPaciente').mask('000.000.000-00');
    if ($('#telefonePaciente').length) $('#telefonePaciente').mask('(00) 00000-0000');
    atualizarRelogio();
});

// ============= FUNÇÕES DE API =============

/**
 * Retorna classificação por ID
 */
async function getClassificacao(id) {
    try {
        return await apiRequest(`/api/classificacoes/${id}`);
    } catch (e) {
        return { id, nome: '???', cor: '', prioridade: 99 };
    }
}

/**
 * Retorna consultório por ID
 */
async function getConsultorio(id) {
    try {
        return await apiRequest(`/api/salas/${id}`);
    } catch (e) {
        return { id, nome: `Sala ${id}`, numero: `S0${id}` };
    }
}

/**
 * Retorna médico por ID
 */
async function getMedico(id) {
    try {
        return await apiRequest(`/api/profissionais/${id}`);
    } catch (e) {
        return { id, nome: 'Médico', especialidade: '' };
    }
}

/**
 * Busca senhas com filtro opcional
 * Ex: buscarSenhas({ status: 'aguardando' })
 */
async function buscarSenhas(filtro = {}) {
    const result = await apiRequest('/api/painel/aguardando');
    return result.data || result || [];
}

/**
 * Cria nova senha
 */
async function criarSenha(dados) {
    const result = await apiRequest('/api/senhas', 'POST', dados);
    return result.data || result;
}

/**
 * Atualiza status/dados de uma senha
 */
async function atualizarSenha(id, dados) {
    const result = await apiRequest(`/api/senhas/${id}`, 'PUT', dados);
    return result.data || result;
}

/**
 * Registra uma chamada
 */
async function registrarChamada(senhaId, consultorioId, medicoId) {
    const result = await apiRequest('/api/chamadas', 'POST', {
        senha_id: senhaId,
        consultorio_id: consultorioId,
        medico_id: medicoId
    });
    return result.data || result;
}

/**
 * Busca a última chamada realizada
 */
async function buscarUltimaChamada() {
    try {
        const result = await apiRequest('/api/painel/ultima');
        return result.data || result || null;
    } catch (e) {
        return null;
    }
}

/**
 * Busca histórico das últimas chamadas
 */
async function buscarUltimasChamadas(limite = 5) {
    try {
        const result = await apiRequest(`/api/painel/chamados`);
        return result.data || result || [];
    } catch (e) {
        return [];
    }
}

/**
 * Calcula estatísticas do dia
 */
async function calcularEstatisticas() {
    try {
        const result = await apiRequest('/api/estatisticas');
        return result.data || result;
    } catch (e) {
        return { total: 0, aguardando: 0, atendendo: 0, finalizado: 0, cancelado: 0 };
    }
}