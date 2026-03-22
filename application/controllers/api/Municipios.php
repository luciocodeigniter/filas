<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Municipios extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        // $this->load->model('Municipio_model');
    }

    /**
     * GET /api/municipios
     */
    public function index()
    {
        // $data = $this->Municipio_model->getAll();
        echo json_encode([]);
    }

    /**
     * GET /api/municipios/{id}
     */
    public function show($id)
    {
        $data = $this->Municipio_model->getById($id);

        if (!$data) {
            http_response_code(404);
            echo json_encode(['message' => 'Município não encontrado']);
            return;
        }

        echo json_encode($data);
    }

    /**
     * POST /api/municipios
     */
    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['nome'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nome é obrigatório']);
            return;
        }

        $id = $this->Municipio_model->insert([
            'nome'       => $input['nome'],
            'secretaria' => $input['secretaria'] ?? '',
            'telefone'   => $input['telefone'] ?? '',
            'logo'       => $input['logo'] ?? '',
            'ativo'      => isset($input['ativo']) ? (int)$input['ativo'] : 1
        ]);

        echo json_encode([
            'message' => 'Criado com sucesso',
            'id' => $id
        ]);
    }

    /**
     * PUT /api/municipios/{id}
     */
    public function update($id)
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['message' => 'Dados inválidos']);
            return;
        }

        $this->Municipio_model->update($id, [
            'nome'       => $input['nome'],
            'secretaria' => $input['secretaria'] ?? '',
            'telefone'   => $input['telefone'] ?? '',
            'logo'       => $input['logo'] ?? '',
            'ativo'      => isset($input['ativo']) ? (int)$input['ativo'] : 1
        ]);

        echo json_encode(['message' => 'Atualizado com sucesso']);
    }

    /**
     * DELETE /api/municipios/{id}
     */
    public function delete($id)
    {
        $this->Municipio_model->delete($id);

        echo json_encode(['message' => 'Excluído com sucesso']);
    }
}
