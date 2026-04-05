/**
 * ============================================
 * RECEPÇÃO - JavaScript (API)
 * ============================================
 */

const API_URL_ATENDIMENTOS = '/api/atendimentos';
const API_URL_TIPOS = '/api/tipos';

let tiposAtendimento = [];

/**
 * =========================
 * TIPOS DE ATENDIMENTO (API)
 * =========================
 */
async function carregarTiposAtendimento() {
    try {
        tiposAtendimento = await apiRequest(API_URL_TIPOS);

        const select = $('#tipoAtendimento');
        select.find('option:not(:first)').remove();

        tiposAtendimento
            .filter(t => t.ativo == '1')
            .forEach(tipo => {
                select.append(`<option value="${tipo.id}">${tipo.nome}</option>`);
            });

    } catch (e) { }
}

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {

    carregarTiposAtendimento();
    carregarUltimasChamadas(); // 🔥 só uma vez agora

    // Limpar formulário
    $('#formCadastroPaciente').on('reset', function () {
        setTimeout(function () {
            $('#nomePaciente').val('');
            $('#cpfPaciente').val('');
            $('#telefonePaciente').val('');
        }, 0);
    });
});

/**
 * =========================
 * CADASTRO DE PACIENTE (API)
 * =========================
 */
$('#formCadastroPaciente').submit(async function (e) {
    e.preventDefault();

    const dados = {
        nome: $('#nomePaciente').val().trim(),
        cpf: $('#cpfPaciente').val(),
        telefone: $('#telefonePaciente').val(),
        tipo_atendimento_id: $('#tipoAtendimento').val(),
    };

    // validações
    if (!dados.nome) {
        exibirNotificacao('Por favor, digite o nome do paciente!', 'danger');
        return;
    }

    const tiposDisponiveis = tiposAtendimento.filter(t => t.ativo == '1');
    if (tiposDisponiveis.length > 0 && !dados.tipo_atendimento_id) {
        exibirNotificacao('Por favor, selecione o tipo de atendimento!', 'danger');
        return;
    }

    try {
        // 🔥 envia para API
        const senha = await apiRequest(`${API_URL_ATENDIMENTOS}/create`, 'POST', dados);

        // 🔥 API já retorna a senha gerada
        exibirModalSenhaGerada(senha);

        $('#formCadastroPaciente')[0].reset();

        exibirNotificacao('Senha gerada com sucesso!', 'success');

        reproduzirSom();

    } catch (e) { }
});

/**
 * =========================
 * MODAL SENHA
 * =========================
 */
function exibirModalSenhaGerada(senha) {

    $('#senhaGeradaNumero').text(senha.numero_senha);
    $('#senhaGeradaNome').text(senha.nome_paciente || senha.nome);

    // 👉 se API já mandar nome da classificação, melhor ainda
    if (senha.classificacao_nome) {
        const badge = $('#senhaGeradaClassificacao');

        badge.text(senha.classificacao_nome);
        badge.removeClass();
        badge.addClass('badge fs-5 ' + (senha.classificacao_classe || 'bg-secondary'));
    }

    const modal = new bootstrap.Modal(document.getElementById('modalSenhaGerada'));
    modal.show();
}

/**
 * =========================
 * ÚLTIMAS CHAMADAS (API)
 * =========================
 */
async function carregarUltimasChamadas() {

    try {
        const chamadas = await apiRequest(API_URL_ATENDIMENTOS + '/latest');

        const container = $('#listaChamadas');
        container.empty();

        if (!chamadas || chamadas.length === 0) {
            container.html(`
                <div class="ultimos-chamados-vazio py-5">
                    <i class="fas fa-tv fa-4x text-muted mb-3"></i>
                    <p class="text-muted mb-0">Nenhuma chamada recente</p>
                </div>
            `);
            return;
        }

        chamadas.forEach(chamada => {

            const item = $(`
                <div class="senha-item ${chamada.classificacao_cor || ''}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-2">
                                <span class="senha-numero me-3">${chamada.numero_senha}</span>
                                ${chamada.classificacao_nome ? `
                                    <span class="badge ${chamada.classificacao_cor || 'bg-secondary'}">
                                        ${chamada.classificacao_nome}
                                    </span>
                                ` : ''}
                            </div>
                            <h6 class="mb-1">${chamada.nome_paciente}</h6>

                            ${chamada.sala_none ? `
                                    <small class="text-muted">
                                        <i class="fas fa-door-open"></i> ${chamada.sala_nome || '-'}
                                        <span class="ms-2">${chamada.data_chamada || ''}</span>
                                    </small>
                                ` : ''}
                        </div>
                    </div>
                </div>
            `);

            container.append(item);
        });

    } catch (e) { }
}

/**
 * =========================
 * ATALHOS
 * =========================
 */
$(document).keydown(function (e) {

    if (e.keyCode === 113) { // F2
        e.preventDefault();
        $('#nomePaciente').focus();
    }

    if (e.keyCode === 27) { // ESC
        $('#formCadastroPaciente')[0].reset();
    }
});