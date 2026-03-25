<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Atendimentos extends CI_Controller
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

        $this->load->model('Atendimento_model');
    }

    /**
     * GET /api/atendimentos
     */
    public function index()
    {
        try {
            $data = $this->Atendimento_model->getAll();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/atendimentos/latest
     */
    public function latest()
    {
        try {
            $data = $this->Atendimento_model->latest(10);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/atendimentos/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->Atendimento_model->getById($id);
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/atendimentos/create
     */
    public function create()
    {
        try {
            $input = get_json_input();

            if (! $input) {
                throw new Exception('Dados inválidos');
            }

            $id = $this->Atendimento_model->insert([
                'tipo_atendimento_id'  => $input['tipo_atendimento_id'] ?? throw new Exception('Tipo de atendimento obrigatório'),
                'nome_paciente'        => $input['nome'],
                'cpf'                  => $input['cpf'] ?? throw new Exception('CPF obrigatório'),
                'telefone'             => $input['telefone'] ?? throw new Exception('Telefone obrigatório'),
            ]);

            // buscamos pelo id para retornar o objeto completo
            $data = $this->Atendimento_model->getById($id);

            return respond(statusCode: 201, data: $data);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * PUT /api/atendimentos/update/{id}
     */
    public function update($id)
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $this->Atendimento_model->update($id, [
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
     * DELETE /api/atendimentos/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->Atendimento_model->delete($id);
            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
