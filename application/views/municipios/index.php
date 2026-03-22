<div class="container mt-4">
	<div class="row">
		<!-- Formulário -->
		<div class="col-md-6">
			<div class="card shadow">
				<div class="card-header bg-success text-white">
					<h5 class="mb-0"><i class="fas fa-map-marker-alt"></i> Cadastro de Município</h5>
				</div>
				<div class="card-body">
					<form id="formMunicipio">
						<input type="hidden" id="municipioId" value="">

						<div class="mb-3">
							<label for="nomeMunicipio" class="form-label">Nome *</label>
							<input type="text" class="form-control" id="nomeMunicipio"
								placeholder="Digite o nome do município" required>
						</div>

						<div class="mb-3">
							<label for="secretariaMunicipio" class="form-label">Secretaria</label>
							<input type="text" class="form-control" id="secretariaMunicipio"
								placeholder="Digite o nome da secretaria">
						</div>

						<div class="mb-3">
							<label for="telefoneMunicipio" class="form-label">Telefone</label>
							<input type="text" class="form-control" id="telefoneMunicipio"
								placeholder="(00) 00000-0000" maxlength="15">
						</div>

						<div class="mb-3">
							<label for="logoMunicipio" class="form-label">Logo</label>
							<input type="file" class="form-control" id="logoMunicipio"
								accept="image/*">
							<small class="text-muted">Formatos: JPG, PNG, GIF (máx. 2MB)</small>
							<div id="previewLogo" class="mt-2 text-center" style="display: none;">
								<img id="previewLogoImg" src="" alt="Preview" class="img-thumbnail" style="max-height: 80px;">
								<button type="button" class="btn btn-sm btn-outline-danger mt-1" id="btnRemoverLogo">
									<i class="fas fa-times"></i> Remover logo
								</button>
							</div>
						</div>

						<div class="mb-4">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="ativoMunicipio" checked>
								<label class="form-check-label" for="ativoMunicipio">Ativo</label>
							</div>
						</div>

						<div class="d-grid gap-2">
							<button type="submit" class="btn btn-success btn-lg">
								<i class="fas fa-save"></i> Salvar
							</button>
							<button type="button" class="btn btn-outline-secondary" id="btnCancelarEdicao" style="display: none;">
								<i class="fas fa-times"></i> Cancelar
							</button>
							<button type="reset" class="btn btn-outline-success">
								<i class="fas fa-eraser"></i> Limpar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<!-- Lista de Municípios -->
		<div class="col-md-6">
			<div class="card shadow">
				<div class="card-header bg-success text-white">
					<h5 class="mb-0"><i class="fas fa-list"></i> Municípios Cadastrados</h5>
				</div>
				<div class="card-body" style="max-height: 550px; overflow-y: auto;">
					<div id="listaMunicipios">
						<!-- Municípios serão inseridos aqui via JavaScript -->
					</div>
				</div>
			</div>
		</div>
	</div>
</div>