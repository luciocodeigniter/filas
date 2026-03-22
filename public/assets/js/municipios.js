/**
 * ============================================
 * MUNICÍPIOS - JavaScript (API)
 * ============================================
 */

const LOGO_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const API_URL = '/api/municipios'; // ajuste se necessário
console.log('API URL:', API_URL);

let municipios = [];
let municipioEmEdicao = null;
let municipioParaExcluir = null;

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

/**
 * =========================
 * LOAD INICIAL
 * =========================
 */

$(document).ready(function () {
    carregarListaMunicipios();

    $('#telefoneMunicipio').mask('(00) 00000-0000');

    $('#logoMunicipio').on('change', function () {
        const file = this.files[0];
        if (!file) return;

        if (file.size > LOGO_MAX_SIZE) {
            exibirNotificacao('A imagem deve ter no máximo 2MB!', 'warning');
            $(this).val('');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            $('#previewLogoImg').attr('src', e.target.result);
            $('#previewLogo').data('base64', e.target.result).show();
        };
        reader.readAsDataURL(file);
    });

    $('#btnRemoverLogo').on('click', function () {
        $('#logoMunicipio').val('');
        $('#previewLogo').hide().removeData('base64');
        $('#previewLogoImg').attr('src', '');
    });

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!municipioParaExcluir) return;

        try {
            await apiRequest(`${API_URL}/${municipioParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Município excluído com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
            municipioParaExcluir = null;

            carregarListaMunicipios();

        } catch (e) { }
    });
});

/**
 * =========================
 * FORM
 * =========================
 */

$('#formMunicipio').on('reset', function () {
    setTimeout(() => {
        $('#municipioId').val('');
        $('#ativoMunicipio').prop('checked', true);
        $('#btnRemoverLogo').click();
        $('#previewLogo').hide();
        municipioEmEdicao = null;
        $('#btnCancelarEdicao').hide();
    }, 0);
});

$('#formMunicipio').submit(async function (e) {
    e.preventDefault();

    const id = $('#municipioId').val();
    const nome = $('#nomeMunicipio').val().trim();
    const secretaria = $('#secretariaMunicipio').val().trim();
    const telefone = $('#telefoneMunicipio').val();
    const ativo = $('#ativoMunicipio').is(':checked');
    let logo = $('#previewLogo').data('base64') || '';

    if (!nome) {
        exibirNotificacao('Por favor, digite o nome do município!', 'warning');
        return;
    }

    if (municipioEmEdicao && !logo && municipioEmEdicao.logo) {
        logo = municipioEmEdicao.logo;
    }

    const payload = {
        nome,
        secretaria,
        telefone,
        logo,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_URL}/${id}`, 'PUT', payload);
            exibirNotificacao('Município atualizado com sucesso!', 'success');
        } else {
            await apiRequest(API_URL, 'POST', payload);
            exibirNotificacao('Município cadastrado com sucesso!', 'success');
        }

        $('#formMunicipio')[0].reset();
        $('#ativoMunicipio').prop('checked', true);
        $('#btnRemoverLogo').trigger('click');
        municipioEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaMunicipios();

    } catch (e) { }
});

/**
 * =========================
 * AÇÕES
 * =========================
 */

function cancelarEdicao() {
    municipioEmEdicao = null;
    $('#formMunicipio')[0].reset();
    $('#municipioId').val('');
    $('#ativoMunicipio').prop('checked', true);
    $('#btnRemoverLogo').trigger('click');
    $('#btnCancelarEdicao').hide();
    carregarListaMunicipios();
}

async function editarMunicipio(id) {
    try {
        const municipio = await apiRequest(`${API_URL}/${id}`);

        municipioEmEdicao = municipio;

        $('#municipioId').val(municipio.id);
        $('#nomeMunicipio').val(municipio.nome);
        $('#secretariaMunicipio').val(municipio.secretaria || '');
        $('#telefoneMunicipio').val(municipio.telefone || '');
        $('#ativoMunicipio').prop('checked', municipio.ativo !== false);

        if (municipio.logo) {
            $('#previewLogoImg').attr('src', municipio.logo);
            $('#previewLogo').data('base64', municipio.logo).show();
        } else {
            $('#previewLogo').hide();
        }

        $('#btnCancelarEdicao').show();
        $('#nomeMunicipio').focus();

    } catch (e) { }
}

function excluirMunicipio(id) {
    municipioParaExcluir = { id };
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */

async function carregarListaMunicipios() {
    const container = $('#listaMunicipios');
    container.empty();

    try {
        municipios = await apiRequest(API_URL);

    } catch (e) {
        container.html('<p class="text-danger">Erro ao carregar municípios</p>');
        return;
    }

    if (!municipios.length) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-map-marker-alt fa-3x mb-3"></i>
                <p>Nenhum município cadastrado</p>
            </div>
        `);
        return;
    }

    municipios.forEach(municipio => {
        const logoHtml = municipio.logo
            ? `<img src="${municipio.logo}" class="rounded me-2" style="height:36px;">`
            : `<span class="bg-light rounded d-inline-flex align-items-center justify-content-center me-2" style="width:36px;height:36px;"><i class="fas fa-image text-muted"></i></span>`;

        const item = $(`
            <div class="card mb-2 ${!municipio.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex align-items-center flex-grow-1">
                            ${logoHtml}
                            <div>
                                <h6 class="mb-0">${municipio.nome}</h6>
                                ${municipio.secretaria ? `<small>${municipio.secretaria}</small><br>` : ''}
                                ${municipio.telefone ? `<small>${municipio.telefone}</small>` : ''}
                            </div>
                        </div>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-primary" onclick="editarMunicipio(${municipio.id})">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="excluirMunicipio(${municipio.id})">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        container.append(item);
    });
}

console.log('Municípios via API carregado!');