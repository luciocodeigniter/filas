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

        $this->load->model('Municipio_model');
    }

    /**
     * GET /api/municipios
     */
    public function index()
    {
        try {
            $data = $this->Municipio_model->getAll();
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * GET /api/municipios/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Municipio_model->getById($id);
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * POST /api/municipios
     */
    public function create()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input || empty($input['nome'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Nome é obrigatório']);
                return;
            }

            $id = $this->Municipio_model->insert([
                'nome'       => $input['nome'],
                'secretaria' => $input['secretaria'] ?? null,
                'telefone'   => $input['telefone'] ?? null,
                'logo'       => empty($input['logo']) ? null : $input['logo'],
                'ativo'      => $input['ativo'] ? 1 : 0
            ]);

            echo json_encode([
                'message' => 'Criado com sucesso',
                'id' => $id
            ]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * PUT /api/municipios/{id}
     */
    public function update($id)
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);


            if (!$input) {
                http_response_code(400);
                echo json_encode(['message' => 'Dados inválidos']);
                return;
            }

            $this->Municipio_model->update($id, [
                'nome'       => $input['nome'],
                'secretaria' => $input['secretaria'] ?? null,
                'telefone'   => $input['telefone'] ?? null,
                'logo'       => empty($input['logo']) ? null : $input['logo'],
                'ativo'      => $input['ativo'] ? 1 : 0
            ]);

            echo json_encode(['message' => 'Atualizado com sucesso']);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    /**
     * DELETE /api/municipios/{id}
     */
    public function delete($id)
    {
        try {
            $this->Municipio_model->delete($id);
            echo json_encode(['message' => 'Deletado com sucesso']);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
}
