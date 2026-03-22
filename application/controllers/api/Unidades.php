<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Unidades extends CI_Controller
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

        $this->load->model('Unidade_model');
    }

    /**
     * GET /api/unidades
     */
    public function index()
    {
        try {
            $data = $this->Unidade_model->getAll();
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * GET /api/unidades/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Unidade_model->getById($id);
            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * POST /api/unidades/create
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

            $id = $this->Unidade_model->insert([
                'nome'         => $input['nome'],
                'municipio_id' => $input['municipio_id'] ?? null,
                'telefone'     => $input['telefone'] ?? null,
                'email'        => $input['email'] ?? null,
                'ativo'        => $input['ativo'] ? 1 : 0
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
     * PUT /api/unidades/{id}
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

            $this->Unidade_model->update($id, [
                'nome'         => $input['nome'],
                'municipio_id' => $input['municipio_id'] ?? null,
                'telefone'     => $input['telefone'] ?? null,
                'email'        => $input['email'] ?? null,
                'ativo'        => $input['ativo'] ? 1 : 0
            ]);

            echo json_encode(['message' => 'Atualizado com sucesso']);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }

    /**
     * DELETE /api/unidades/{id}
     */
    public function delete($id)
    {
        try {
            $this->Unidade_model->delete($id);
            echo json_encode(['message' => 'Deletado com sucesso']);
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode(['message' => $th->getMessage()]);
        }
    }
}
