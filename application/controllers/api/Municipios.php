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
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/municipios/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Municipio_model->getById($id);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/municipios/create
     */
    public function create()
    {
        try {
            $input = get_json_input();

            if (!$input || empty($input['nome'])) {
                throw new Exception('Nome é obrigatório');
            }

            $id = $this->Municipio_model->insert([
                'nome'       => $input['nome'],
                'secretaria' => $input['secretaria'] ?? null,
                'telefone'   => $input['telefone'] ?? null,
                'logo'       => empty($input['logo']) ? null : $input['logo'],
                'ativo'      => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 201, data: $id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * PUT /api/municipios/update/{id}
     */
    public function update($id)
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $this->Municipio_model->update($id, [
                'nome'       => $input['nome'],
                'secretaria' => $input['secretaria'] ?? null,
                'telefone'   => $input['telefone'] ?? null,
                'logo'       => empty($input['logo']) ? null : $input['logo'],
                'ativo'      => $input['ativo'] ? 1 : 0
            ]);

            return respond(statusCode: 200, message: 'Atualizado com sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * DELETE /api/municipios/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->Municipio_model->delete($id);
            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
