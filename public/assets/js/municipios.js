/**
 * ============================================
 * MUNICÍPIOS - JavaScript
 * CRUD de Municípios (nome, secretaria, telefone, logo)
 * ============================================
 */

const LOGO_MAX_SIZE = 2 * 1024 * 1024; // 2MB

let municipios = [];
let municipioEmEdicao = null;
let municipioParaExcluir = null;

if (localStorage.getItem('municipios')) {
    try {
        municipios = JSON.parse(localStorage.getItem('municipios'));
    } catch (e) {
        console.error('Erro ao carregar municípios:', e);
    }
}

function salvarMunicipios() {
    localStorage.setItem('municipios', JSON.stringify(municipios));
}

$(document).ready(function() {
    carregarListaMunicipios();
    
    // Máscara de telefone
    $('#telefoneMunicipio').mask('(00) 00000-0000');
    
    // Upload de logo - converter para base64
    $('#logoMunicipio').on('change', function() {
        const file = this.files[0];
        if (!file) return;
        
        if (file.size > LOGO_MAX_SIZE) {
            exibirNotificacao('A imagem deve ter no máximo 2MB!', 'warning');
            $(this).val('');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#previewLogoImg').attr('src', e.target.result);
            $('#previewLogo').data('base64', e.target.result).show();
        };
        reader.readAsDataURL(file);
    });
    
    // Remover logo
    $('#btnRemoverLogo').on('click', function() {
        $('#logoMunicipio').val('');
        $('#previewLogo').hide().removeData('base64');
        $('#previewLogoImg').attr('src', '');
    });
    
    // Cancelar edição
    $('#btnCancelarEdicao').on('click', function() {
        cancelarEdicao();
    });
    
    // Confirmar exclusão
    $('#btnConfirmarExcluir').on('click', function() {
        if (municipioParaExcluir !== null) {
            municipios = municipios.filter(m => m.id !== municipioParaExcluir.id);
            salvarMunicipios();
            carregarListaMunicipios();
            exibirNotificacao('Município excluído com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
            municipioParaExcluir = null;
        }
    });
});

$('#formMunicipio').on('reset', function() {
    setTimeout(() => {
        $('#municipioId').val('');
        $('#ativoMunicipio').prop('checked', true);
        $('#btnRemoverLogo').click();
        $('#previewLogo').hide();
        municipioEmEdicao = null;
        $('#btnCancelarEdicao').hide();
    }, 0);
});

$('#formMunicipio').submit(function(e) {
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
    
    if (id) {
        // Atualizar
        const municipio = municipios.find(m => m.id == id);
        if (municipio) {
            municipio.nome = nome;
            municipio.secretaria = secretaria;
            municipio.telefone = telefone || '';
            municipio.logo = logo;
            municipio.ativo = ativo;
            salvarMunicipios();
            exibirNotificacao('Município atualizado com sucesso!', 'success');
        }
    } else {
        // Criar
        const municipio = {
            id: Date.now(),
            nome: nome,
            secretaria: secretaria || '',
            telefone: telefone || '',
            logo: logo,
            ativo: ativo
        };
        municipios.push(municipio);
        salvarMunicipios();
        exibirNotificacao('Município cadastrado com sucesso!', 'success');
    }
    
    $('#formMunicipio')[0].reset();
    $('#ativoMunicipio').prop('checked', true);
    $('#btnRemoverLogo').trigger('click');
    municipioEmEdicao = null;
    $('#btnCancelarEdicao').hide();
    carregarListaMunicipios();
});

function cancelarEdicao() {
    municipioEmEdicao = null;
    $('#formMunicipio')[0].reset();
    $('#municipioId').val('');
    $('#ativoMunicipio').prop('checked', true);
    $('#btnRemoverLogo').trigger('click');
    $('#btnCancelarEdicao').hide();
    carregarListaMunicipios();
}

function editarMunicipio(id) {
    const municipio = municipios.find(m => m.id === id);
    if (!municipio) return;
    
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
}

function excluirMunicipio(id) {
    const municipio = municipios.find(m => m.id === id);
    if (!municipio) return;
    
    municipioParaExcluir = municipio;
    $('#modalExcluirNome').text(municipio.nome);
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

function carregarListaMunicipios() {
    const container = $('#listaMunicipios');
    container.empty();
    
    if (municipios.length === 0) {
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
            ? `<img src="${municipio.logo}" alt="Logo" class="rounded me-2" style="height: 36px; width: auto; object-fit: contain;">`
            : `<span class="bg-light rounded d-inline-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;"><i class="fas fa-image text-muted"></i></span>`;
        
        const item = $(`
            <div class="card mb-2 ${!municipio.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex align-items-center flex-grow-1 min-width-0">
                            ${logoHtml}
                            <div class="flex-grow-1">
                                <h6 class="mb-0">${municipio.nome}</h6>
                                ${municipio.secretaria ? `<small class="text-muted"><i class="fas fa-landmark"></i> ${municipio.secretaria}</small><br>` : ''}
                                ${municipio.telefone ? `<small class="text-muted"><i class="fas fa-phone"></i> ${municipio.telefone}</small>` : ''}
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-1 ms-2">
                            <span class="badge ${municipio.ativo ? 'bg-success' : 'bg-secondary'}">
                                ${municipio.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-primary" onclick="editarMunicipio(${municipio.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirMunicipio(${municipio.id})" title="Excluir">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        container.append(item);
    });
}

console.log('Municípios carregado com sucesso!');
