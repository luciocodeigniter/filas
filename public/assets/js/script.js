/**
 * ============================================
 * SISTEMA DE PAINEL DE SENHAS - HOSPITAL
 * Script Principal - Funções Compartilhadas
 * ============================================
 */

/**
 * =========================
 * API HELPERS
 * =========================
 */

async function apiRequest(url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
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
// const CONFIG = {
//     apiUrl: 'api/', // URL base da API PHP
//     atualizacaoAutomatica: 5000, // 5 segundos
//     tempoOverlayChamada: 5000 // 5 segundos
// };

// ============= DADOS MOCKADOS (SIMULAÇÃO) =============
let dadosMockados = {
    senhas: [],
    classificacoes: [
        { id: 1, nome: 'EMERGÊNCIA', cor: 'vermelho', prioridade: 1 },
        { id: 2, nome: 'MUITO URGENTE', cor: 'laranja', prioridade: 2 },
        { id: 3, nome: 'URGENTE', cor: 'amarelo', prioridade: 3 },
        { id: 4, nome: 'POUCO URGENTE', cor: 'verde', prioridade: 4 },
        { id: 5, nome: 'NÃO URGENTE', cor: 'azul', prioridade: 5 }
    ],
    consultorios: [
        { id: 1, numero: 'S01', nome: 'Sala 1' },
        { id: 2, numero: 'S02', nome: 'Sala 2' },
        { id: 3, numero: 'S03', nome: 'Sala 3' },
        { id: 4, numero: 'S04', nome: 'Sala 4' },
        { id: 5, numero: 'S05', nome: 'Sala 5' }
    ],
    medicos: [
        { id: 1, nome: 'João Silva', especialidade: 'Clínica Geral' },
        { id: 2, nome: 'Maria Santos', especialidade: 'Pediatria' },
        { id: 3, nome: 'Carlos Oliveira', especialidade: 'Cardiologia' },
        { id: 4, nome: 'Ana Costa', especialidade: 'Ortopedia' }
    ],
    proximoNumeroSenha: 1,
    chamadas: []
};

// Carregar dados do localStorage se existirem
if (localStorage.getItem('dadosSistema')) {
    try {
        dadosMockados = JSON.parse(localStorage.getItem('dadosSistema'));
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
    }
}

// Classificações do CRUD têm prioridade (Recepção, Triagem, Atendimento)
if (localStorage.getItem('classificacoesRisco')) {
    try {
        const cr = JSON.parse(localStorage.getItem('classificacoesRisco'));
        dadosMockados.classificacoes = cr.filter(c => c.ativo !== false).map(c => ({
            id: c.id,
            nome: c.nome,
            cor: c.cor,
            prioridade: c.prioridade || 99,
            tempo_estimado_min: c.tempo_estimado_min
        }));
    } catch (e) {
        console.error('Erro ao carregar classificações:', e);
    }
}

// ============= FUNÇÕES UTILITÁRIAS =============

/**
 * Formata data e hora
 */
function formatarDataHora(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleString('pt-BR');
}

/**
 * Formata apenas hora
 */
function formatarHora(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleTimeString('pt-BR');
}

/**
 * Formata apenas data
 */
function formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

/**
 * Calcula tempo decorrido em minutos
 */
function calcularTempoDecorrido(dataInicio) {
    const agora = new Date();
    const inicio = new Date(dataInicio);
    const diff = Math.floor((agora - inicio) / 1000 / 60);
    return diff;
}

/**
 * Formata tempo de espera para exibição
 */
function formatarTempoEspera(minutos) {
    if (minutos < 60) {
        return `${minutos} min`;
    } else {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas}h ${mins}min`;
    }
}

/**
 * Gera número de senha sequencial
 */
function gerarNumeroSenha() {
    const prefixo = 'S';
    const numero = String(dadosMockados.proximoNumeroSenha).padStart(3, '0');
    dadosMockados.proximoNumeroSenha++;
    salvarDados();
    return prefixo + numero;
}

/**
 * Salva dados no localStorage
 */
function salvarDados() {
    localStorage.setItem('dadosSistema', JSON.stringify(dadosMockados));
}

/**
 * Retorna classificação por ID
 */
function getClassificacao(id) {
    return dadosMockados.classificacoes.find(c => c.id == id);
}

/**
 * Retorna consultório por ID
 */
function getConsultorio(id) {
    return dadosMockados.consultorios.find(c => c.id == id);
}

/**
 * Retorna médico por ID
 */
function getMedico(id) {
    return dadosMockados.medicos.find(m => m.id == id);
}

/**
 * Retorna classe CSS da classificação
 */
function getClasseClassificacao(classificacaoId) {
    const classificacao = getClassificacao(classificacaoId);
    if (!classificacao) return 'badge-secondary';

    const mapa = {
        'vermelho': 'badge-vermelho',
        'laranja': 'badge-laranja',
        'amarelo': 'badge-amarelo',
        'verde': 'badge-verde',
        'azul': 'badge-azul'
    };

    return mapa[classificacao.cor] || 'badge-secondary';
}

/**
 * Exibe notificação toast
 */
function exibirNotificacao(mensagem, tipo = 'success') {
    // Cria elemento de notificação
    const toast = $('<div>')
        .addClass(`alert alert-${tipo} alert-dismissible fade show position-fixed`)
        .css({
            'top': '20px',
            'right': '20px',
            'z-index': '9999',
            'min-width': '300px'
        })
        .html(`
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `);

    $('body').append(toast);

    // Remove após 5 segundos
    setTimeout(() => {
        toast.fadeOut(() => toast.remove());
    }, 5000);
}

/**
 * Reproduz som de notificação
 */
function reproduzirSom() {
    // Cria um beep usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Áudio não suportado');
    }
}

// ============= RELÓGIO EM TEMPO REAL =============
function atualizarRelogio() {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR');
    const data = agora.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    $('#relogio, #relogioPainel').text(hora);
    $('#dataPainel').text(data);
}

// Atualiza relógio a cada segundo
setInterval(atualizarRelogio, 1000);

// ============= MÁSCARAS DE INPUT =============
$(document).ready(function () {
    // Máscara de CPF
    if ($('#cpfPaciente').length) {
        $('#cpfPaciente').mask('000.000.000-00');
    }


    // Máscara de Telefone
    if ($('#telefonePaciente').length) {
        $('#telefonePaciente').mask('(00) 00000-0000');
    }


    // Atualiza relógio imediatamente
    atualizarRelogio();
});

// ============= FUNÇÕES DE API (SIMULADAS) =============

/**
 * Busca todas as senhas
 */
function buscarSenhas(filtro = {}) {
    return new Promise((resolve) => {
        let senhas = [...dadosMockados.senhas];

        // Aplica filtros
        if (filtro.status) {
            senhas = senhas.filter(s => s.status === filtro.status);
        }

        // Ordena por prioridade e data de entrada
        senhas.sort((a, b) => {
            const classA = getClassificacao(a.classificacao_risco_id);
            const classB = getClassificacao(b.classificacao_risco_id);

            if (classA.prioridade !== classB.prioridade) {
                return classA.prioridade - classB.prioridade;
            }

            return new Date(a.data_entrada) - new Date(b.data_entrada);
        });

        resolve(senhas);
    });
}

/**
 * Cria nova senha
 */
function criarSenha(dados) {
    return new Promise((resolve) => {
        const novaSenha = {
            id: Date.now(),
            numero_senha: gerarNumeroSenha(),
            nome_paciente: dados.nome,
            cpf: dados.cpf || '',
            telefone: dados.telefone || '',
            tipo_atendimento_id: dados.tipo_atendimento_id ? parseInt(dados.tipo_atendimento_id) : null,
            classificacao_risco_id: parseInt(dados.classificacao),
            status: 'aguardando',
            data_entrada: new Date().toISOString(),
            data_chamada: null,
            data_atendimento: null,
            data_finalizacao: null,
            consultorio_id: null,
            medico_id: null
        };

        dadosMockados.senhas.push(novaSenha);
        salvarDados();

        resolve(novaSenha);
    });
}

/**
 * Atualiza status da senha
 */
function atualizarSenha(id, dados) {
    return new Promise((resolve) => {
        const senha = dadosMockados.senhas.find(s => s.id === id);

        if (senha) {
            Object.assign(senha, dados);
            salvarDados();
            resolve(senha);
        } else {
            resolve(null);
        }
    });
}

/**
 * Registra chamada
 */
function registrarChamada(senhaId, consultorioId, medicoId) {
    return new Promise((resolve) => {
        const chamada = {
            id: Date.now(),
            senha_id: senhaId,
            consultorio_id: consultorioId,
            medico_id: medicoId,
            data_chamada: new Date().toISOString()
        };

        dadosMockados.chamadas.push(chamada);
        salvarDados();

        resolve(chamada);
    });
}

/**
 * Busca última chamada
 */
function buscarUltimaChamada() {
    return new Promise((resolve) => {
        if (dadosMockados.chamadas.length === 0) {
            resolve(null);
            return;
        }

        const ultimaChamada = dadosMockados.chamadas[dadosMockados.chamadas.length - 1];
        const senha = dadosMockados.senhas.find(s => s.id === ultimaChamada.senha_id);

        if (senha) {
            resolve({
                ...ultimaChamada,
                senha: senha
            });
        } else {
            resolve(null);
        }
    });
}

/**
 * Busca últimas chamadas (histórico)
 */
function buscarUltimasChamadas(limite = 5) {
    return new Promise((resolve) => {
        const chamadas = [...dadosMockados.chamadas]
            .reverse()
            .slice(0, limite)
            .map(chamada => {
                const senha = dadosMockados.senhas.find(s => s.id === chamada.senha_id);
                return {
                    ...chamada,
                    senha: senha
                };
            });

        resolve(chamadas);
    });
}

// ============= ESTATÍSTICAS =============

/**
 * Calcula estatísticas do dia
 */
function calcularEstatisticas() {
    const hoje = new Date().toDateString();
    const senhasHoje = dadosMockados.senhas.filter(s => {
        return new Date(s.data_entrada).toDateString() === hoje;
    });

    return {
        total: senhasHoje.length,
        aguardando: senhasHoje.filter(s => s.status === 'aguardando').length,
        atendendo: senhasHoje.filter(s => s.status === 'atendendo').length,
        finalizado: senhasHoje.filter(s => s.status === 'finalizado').length,
        cancelado: senhasHoje.filter(s => s.status === 'cancelado').length
    };
}

// ============= IMPRESSÃO =============

/**
 * Imprime senha
 */
function imprimirSenha() {
    window.print();
}

