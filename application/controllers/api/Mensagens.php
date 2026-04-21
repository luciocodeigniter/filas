<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Mensagens extends CI_Controller
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

        $this->load->model('Mensagem_model');
    }

    /**
     * GET /api/mensagens
     */
    public function index()
    {
        try {
            $data = $this->Mensagem_model->getAll();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/mensagens/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Mensagem_model->getById($id);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/mensagens/create
     */
    public function create()
    {
        try {
            $input = get_json_input();

            if (!$input || empty($input['titulo'])) {
                throw new Exception('Titulo é obrigatório');
            }

            $id = $this->Mensagem_model->insert([
                'titulo'   => $input['titulo'],
                'conteudo' => $input['conteudo'] ?? null,
                'ordem'    => $input['ordem'] ?? null,
                'ativo'    => $input['ativo'] ? 1 : 0
            ]);

            $this->pusher_lib->trigger('painel', 'mensagens-atualizadas', []);

            return respond(statusCode: 201, data: $id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * PUT /api/mensagens/update/{id}
     */
    public function update($id)
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $this->Mensagem_model->update($id, [
                'titulo'   => $input['titulo'],
                'conteudo' => $input['conteudo'] ?? null,
                'ordem'    => $input['ordem'] ?? null,
                'ativo'    => $input['ativo'] ? 1 : 0
            ]);

            $this->pusher_lib->trigger('painel', 'mensagens-atualizadas', []);

            return respond(statusCode: 200, message: 'Atualizado com sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * DELETE /api/mensagens/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->Mensagem_model->delete($id);

            $this->pusher_lib->trigger('painel', 'mensagens-atualizadas', []);

            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
