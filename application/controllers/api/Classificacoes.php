<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Classificacoes extends CI_Controller
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

        $this->load->model('Classificacao_model');
    }

    /**
     * GET /api/classificacoes
     */
    public function index()
    {
        try {
            $data = $this->Classificacao_model->getAll();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/classificacoes/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Classificacao_model->getById($id);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/classificacoes/create
     */
    public function create()
    {
        try {
            $input = get_json_input();

            if (!$input || empty($input['nome'])) {
                throw new Exception('Nome é obrigatório');
            }

            $id = $this->Classificacao_model->insert([
                'nome'               => $input['nome'],
                'cor'                => $input['cor'] ?? null,
                'prioridade'         => $input['prioridade'] ?? null,
                'tempo_estimado_min' => $input['tempo_estimado_min'] ?? null,
                'ativo'              => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 201, data: $id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * PUT /api/classificacoes/update/{id}
     */
    public function update($id)
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $this->Classificacao_model->update($id, [
                'nome'               => $input['nome'],
                'cor'                => $input['cor'] ?? null,
                'prioridade'         => $input['prioridade'] ?? null,
                'tempo_estimado_min' => $input['tempo_estimado_min'] ?? null,
                'ativo'              => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 200, message: 'Atualizado com sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * DELETE /api/classificacoes/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->Classificacao_model->delete($id);
            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
