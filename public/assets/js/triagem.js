/**
 * ============================================
 * TRIAGEM - JavaScript
 * Funções específicas da página de triagem (Classificação de Risco)
 * ============================================
 */

async function carregarClassificacoesRisco() {
    const container = $('#listaClassificacaoRisco');
    container.empty();

    try {
        const classificacoes = await apiRequest('/api/classificacoes');

        if (!classificacoes || classificacoes.length === 0) {
            container.html('<p class="text-muted">Nenhuma classificação cadastrada</p>');
            return;
        }

        classificacoes.sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99));

        classificacoes.forEach((c, i) => {
            const tempo = c.tempo_estimado_min != null
                ? (c.tempo_estimado_min === 0 ? 'Atendimento imediato' : `Até ${c.tempo_estimado_min} minutos`)
                : '';
            const corClass = `risco-${c.cor}`;
            const item = $(`
                <div class="form-check classificacao-item ${corClass}">
                    <input class="form-check-input" type="radio" name="classificacao" 
                           id="risco${c.id}" value="${c.id}" ${i === 0 ? 'required' : ''}>
                    <label class="form-check-label" for="risco${c.id}">
                        <strong>${c.nome}</strong>
                        ${tempo ? `<small>${tempo}</small>` : ''}
                    </label>
                </div>
            `);
            container.append(item);
        });

    } catch (error) {
        container.html('<p class="text-danger">Erro ao carregar classificações de risco.</p>');
    }
}

/**
 * =========================
 * ÚLTIMAS CHAMADAS (API)
 * =========================
 */
async function carregarUltimasChamadas() {

    try {
        const chamadas = await apiRequest('/api/atendimentos/aguardando');

        const container = $('#listaChamadas');
        container.empty();

        if (!chamadas || chamadas.length === 0) {
            container.html(`
                <div class="ultimos-chamados-vazio py-5">
                    <i class="fas fa-tv fa-4x text-muted mb-3"></i>
                    <p class="text-muted mb-0">Nenhum atendimento aguardando triagem</p>
                </div>
            `);
            return;
        }

        chamadas.forEach(chamada => {

            const item = $(`
                <label for="atendimento${chamada.id}" class="senha-item ${chamada.classificacao_cor || ''} d-block" style="cursor: pointer;">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-2">
                                <input class="form-check-input me-2" required type="radio" name="atendimento_id"
                                       id="atendimento${chamada.id}" value="${chamada.id}">
                                <span class="senha-numero me-3">${chamada.numero_senha}</span>
                                ${chamada.classificacao_nome ? `
                                    <span class="badge ${chamada.classificacao_cor || 'bg-secondary'}">
                                        ${chamada.classificacao_nome}
                                    </span>
                                ` : ''}
                            </div>
                            <h6 class="mb-1">${chamada.nome_paciente}</h6>

                            ${chamada.sala_nome ? `
                                <small class="text-muted">
                                    <i class="fas fa-door-open"></i> ${chamada.sala_nome || '-'}
                                    <span class="ms-2">${chamada.data_chamada || ''}</span>
                                </small>
                            ` : ''}
                        </div>
                    </div>
                </label>
            `);

            container.append(item);
        });

    } catch (e) { }
}

$(document).ready(function () {
    carregarClassificacoesRisco();
    carregarUltimasChamadas();
    atualizarRelogio();
});

$('#formClassificacaoRisco').submit(async function (e) {
    e.preventDefault();

    const motivoPrincipal = $('#motivoPrincipal').val().trim();
    const classificacao = $('input[name="classificacao"]:checked').val();
    const atendimentoId = $('input[name="atendimento_id"]:checked').val();

    if (!motivoPrincipal) {
        exibirNotificacao('Por favor, digite o motivo principal!', 'warning');
        return;
    }

    if (!classificacao) {
        exibirNotificacao('Por favor, escolha a classificação de risco!', 'warning');
        return;
    }

    if (!atendimentoId) {
        exibirNotificacao('Por favor, selecione um atendimento!', 'warning');
        return;
    }

    const payload = {
        classificacao_id: classificacao,
        atendimento_id: atendimentoId,
        motivo_principal: motivoPrincipal
    };

    try {
        await apiRequest('/api/atendimentos/classificar', 'POST', payload);

        exibirNotificacao('Classificação registrada com sucesso!', 'success');

        $('#formClassificacaoRisco')[0].reset();

        carregarUltimasChamadas();

    } catch (e) {
        exibirNotificacao('Erro ao registrar classificação!', 'danger');
    }
});