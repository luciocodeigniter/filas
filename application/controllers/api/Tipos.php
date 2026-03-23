<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Tipos de atendimentos
 */
class Tipos extends CI_Controller
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

        $this->load->model('Tipo_model');
    }

    /**
     * GET /api/tipos
     */
    public function index()
    {
        try {
            $data = $this->Tipo_model->getAll();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/tipos/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Tipo_model->getById($id);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/tipos/create
     */
    public function create()
    {
        try {
            $input = get_json_input();

            if (!$input || empty($input['nome'])) {
                throw new Exception('Nome é obrigatório');
            }

            $id = $this->Tipo_model->insert([
                'nome'  => $input['nome'],
                'ativo' => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 201, data: $id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * PUT /api/tipos/update/{id}
     */
    public function update($id)
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $this->Tipo_model->update($id, [
                'nome'  => $input['nome'],
                'ativo' => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 200, message: 'Atualizado com sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * DELETE /api/tipos/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->Tipo_model->delete($id);
            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
