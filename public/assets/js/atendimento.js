/**
 * ============================================
 * ATENDIMENTO - JavaScript
 * Funções específicas da página de atendimento
 * ============================================
 */

let senhaAtual = null;
let senhaEmAtendimento = null;

$(document).ready(function () {
    atualizarFila();
    atualizarHistorico();
    atualizarEstatisticasConsultorio();

    //! aqui faremos o com pusher
    // setInterval(() => {
    //     atualizarFila();
    //     atualizarHistorico();
    //     atualizarEstatisticasConsultorio();
    // }, CONFIG.atualizacaoAutomatica);
});

// ============= ATUALIZAR FILA DE ESPERA =============

async function atualizarFila() {

    //! aqui faremos o com pusher
    try {
        const senhas = await apiRequest('/api/atendimentos/triados');
        const tbody = $('#corpoTabelaFila');
        tbody.empty();

        if (senhas.length === 0) {
            tbody.html(`
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-inbox fa-2x mb-2"></i>
                        <p>Nenhum paciente aguardando</p>
                    </td>
                </tr>
            `);
            $('#btnChamar').prop('disabled', true);
            $('#proximaSenha').text('---');
            $('#proximoNome').text('Aguardando...');
            $('#proximaClassificacao').text('').removeClass();
            return;
        }

        atualizarProximoPaciente(senhas[0]);

        await Promise.all(senhas.map(async (senha, index) => {
            const classificacao = senha.classificacao_risco_id === null
                ? null
                : await getClassificacao(senha.classificacao_risco_id);

            const tempoEspera = calcularTempoDecorrido(senha.data_entrada);

            const row = $(`
                <tr data-senha-id="${senha.id}" ${index === 0 ? 'class="table-primary"' : ''}>
                    <td>
                        <strong>${senha.numero_senha}</strong>
                        ${index === 0 ? '<span class="badge bg-primary ms-1">Próximo</span>' : ''}
                    </td>
                    <td>${senha.nome_paciente}</td>
                    <td>
                        <span class="badge ${classificacao === null ? 'badge-secondary' : getClasseClassificacao(classificacao.cor)}">
                            ${classificacao === null ? '' : classificacao.nome}
                        </span>
                    </td>
                    <td>
                        <small>${formatarTempoEspera(tempoEspera)}</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="chamarPacienteEspecifico(${senha.id})">
                            <i class="fas fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `);

            tbody.append(row);
        }));

        $('#totalFila').text(senhas.length);
    } catch (error) {
        console.error('Erro ao atualizar fila:', error);
    }
}

// ============= ATUALIZAR PRÓXIMO PACIENTE =============

function atualizarProximoPaciente(senha) {
    if (!senha) {
        $('#proximaSenha').text('---');
        $('#proximoNome').text('Aguardando...');
        $('#proximaClassificacao').text('').removeClass();
        $('#btnChamar').prop('disabled', true);
        senhaAtual = null;
        return;
    }

    senhaAtual = senha;
    const classificacao = senha.classificacao_risco_id === null ? null : getClassificacao(senha.classificacao_risco_id);

    $('#proximaSenha').text(senha.numero_senha);
    $('#proximoNome').text(senha.nome_paciente);

    const badge = $('#proximaClassificacao');
    badge.text(classificacao.nome);
    badge.removeClass().addClass('badge fs-6').addClass(getClasseClassificacao(classificacao === null ? null : classificacao.cor));

    $('#btnChamar').prop('disabled', false);
}

// ============= CHAMAR PACIENTE =============

async function chamarPaciente() {
    if (!senhaAtual) {
        exibirNotificacao('Nenhum paciente na fila!', 'warning');
        return;
    }

    const consultorioId = parseInt($('#selectConsultorio').val());
    const medicoId = parseInt($('#selectMedico').val());

    try {
        await apiRequest(`/api/atendimentos/chamar`, 'PUT', {
            atendimento_id: senhaAtual.id,
            sala_id: consultorioId,
            profissional_id: medicoId
        });

        const consultorio = await apiRequest(`/api/salas/${consultorioId}`);

        $('#modalSenha').text(senhaAtual.numero_senha);
        $('#modalNome').text(senhaAtual.nome_paciente);
        $('#modalConsultorio').text(consultorio.nome);

        const modal = new bootstrap.Modal(document.getElementById('modalChamar'));
        modal.show();
        reproduzirSom();
        setTimeout(() => modal.hide(), 20000); // 20 segundos

        exibirNotificacao(`Paciente ${senhaAtual.numero_senha} chamado!`, 'success');

        $('#btnIniciarAtendimento').prop('disabled', false);
        $('#btnChamar').prop('disabled', true);

        setTimeout(() => {
            atualizarFila();
            atualizarHistorico();
        }, 500);
    } catch (error) {
        console.error('Erro ao chamar paciente:', error);
    }
}

// ============= CHAMAR PACIENTE ESPECÍFICO =============

async function chamarPacienteEspecifico(senhaId) {
    try {
        const atendimento = await apiRequest(`/api/atendimentos/${senhaId}`);

        if (atendimento) {
            console.log(atendimento);
            senhaAtual = atendimento.numero_senha;
            atualizarProximoPaciente(atendimento);
            chamarPaciente();
        }
    } catch (error) {
        console.error('Erro ao buscar senha específica:', error);
        exibirNotificacao(error.message || 'Erro inesperado ao chamar o paciente específico', 'danger');
    }
}

// ============= INICIAR ATENDIMENTO =============

async function iniciarAtendimento() {
    if (!senhaAtual) {
        exibirNotificacao('Nenhum paciente chamado!', 'warning');
        return;
    }

    try {
        await apiRequest(`/api/senhas/${senhaAtual.id}`, 'PUT', {
            status: 'atendendo',
            data_atendimento: new Date().toISOString()
        });

        senhaEmAtendimento = senhaAtual;

        $('#cardAtendimento').show();
        $('#atendimentoNome').text(senhaAtual.nome_paciente);
        $('#atendimentoSenha').text(senhaAtual.numero_senha);
        $('#atendimentoHora').text(formatarHora(new Date()));

        $('#btnIniciarAtendimento').prop('disabled', true);
        $('#btnFinalizarAtendimento').prop('disabled', false);

        exibirNotificacao('Atendimento iniciado!', 'info');

        senhaAtual = null;
        atualizarFila();
    } catch (error) {
        console.error('Erro ao iniciar atendimento:', error);
    }
}

// ============= FINALIZAR ATENDIMENTO =============

async function finalizarAtendimento() {
    if (!senhaEmAtendimento) {
        exibirNotificacao('Nenhum atendimento em andamento!', 'warning');
        return;
    }

    try {
        await apiRequest(`/api/senhas/${senhaEmAtendimento.id}`, 'PUT', {
            status: 'finalizado',
            data_finalizacao: new Date().toISOString()
        });

        exibirNotificacao('Atendimento finalizado!', 'success');

        $('#cardAtendimento').hide();
        senhaEmAtendimento = null;

        $('#btnFinalizarAtendimento').prop('disabled', true);

        atualizarEstatisticasConsultorio();
        atualizarFila();
    } catch (error) {
        console.error('Erro ao finalizar atendimento:', error);
    }
}

// ============= ATUALIZAR HISTÓRICO =============

async function atualizarHistorico() {
    try {
        const chamadas = await apiRequest('/api/atendimentos/chamados');
        const container = $('#historicoChamadas');
        container.empty();

        if (chamadas.length === 0) {
            container.html(`
                <div class="text-center text-muted py-3">
                    <small>Nenhuma chamada registrada</small>
                </div>
            `);
            return;
        }

        chamadas.forEach(chamada => {
            if (!chamada.senha) return;

            const classificacao = getClassificacao(chamada.senha.classificacao_risco_id);
            const consultorio = chamada.consultorio;

            const item = $(`
                <div class="list-group-item list-group-item-action list-group-item-chamada">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${chamada.senha.numero_senha}</strong> - ${chamada.senha.nome_paciente}
                            <br>
                            <small class="text-muted">
                                <i class="fas fa-door-open"></i> ${consultorio.nome}
                                <span class="ms-2">${formatarHora(chamada.data_chamada)}</span>
                            </small>
                        </div>
                        <span class="badge ${getClasseClassificacao(chamada.senha.classificacao_risco_id)}">
                            ${classificacao.nome}
                        </span>
                    </div>
                </div>
            `);

            container.append(item);
        });
    } catch (error) {
        console.error('Erro ao atualizar histórico:', error);
    }
}

// ============= ATUALIZAR ESTATÍSTICAS =============

async function atualizarEstatisticasConsultorio() {
    try {
        const stats = await apiRequest('/api/estatisticas');
        $('#totalAtendimentos').text(stats.finalizado);
    } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
    }
}

// ============= ATALHOS DE TECLADO =============

$(document).keydown(function (e) {
    if (e.keyCode === 116) { e.preventDefault(); chamarPaciente(); }
    if (e.keyCode === 117) { e.preventDefault(); iniciarAtendimento(); }
    if (e.keyCode === 118) { e.preventDefault(); finalizarAtendimento(); }
});
