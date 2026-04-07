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
        $this->load->model('Classificacao_model');
        $this->load->model('Sala_model');
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
     * GET /api/atendimentos/aguardando
     * 
     * Recupera os atendimentos que estão aguardando triagem
     */
    public function aguardando()
    {
        try {
            $data = $this->Atendimento_model->aguardando();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/atendimentos/triados
     * 
     * Recupera os atendimentos que já passaram pela triagem e estão aguardando definição de sala
     */
    public function triados()
    {
        try {
            $data = $this->Atendimento_model->triados();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/atendimentos/chamados
     * 
     * Recupera os atendimentos que já foram chamados. 
     */
    public function chamados()
    {
        try {
            $data = $this->Atendimento_model->chamados(limit: 10);
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
     * PUT /api/atendimentos/classificar
     */
    public function classificar()
    {
        try {
            $input = get_json_input();


            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $atendimentoId   = $input['atendimento_id'] ?? throw new Exception('Atendimento obrigatório');
            $classificacaoId = $input['classificacao_id'] ?? throw new Exception('Classificação de risco obrigatório');
            $motivoPrincipal = $input['motivo_principal'] ?? throw new Exception('Motivo principal obrigatório');


            // buscamos o atendimento
            $atendimento = $this->Atendimento_model->getById($atendimentoId);

            if (!$atendimento) {
                throw new Exception('Atendimento inválido');
            }

            // buscamos a classificação de risco
            $classificacao = $this->Classificacao_model->getById($classificacaoId);

            $this->Atendimento_model->update($atendimentoId, [
                'classificacao_risco_id' => $classificacao->id,
                'motivo_principal'       => $motivoPrincipal,
                'status'                 => 'triado'
            ]);

            return respond(statusCode: 200, message: 'Sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * PUT /api/atendimentos/chamar
     * 
     * Executado quando o atendente chama o paciente para ir ao consultório (sala)
     */
    public function chamar()
    {
        try {

            $input = get_json_input();

            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $atendimentoId   = $input['atendimento_id'] ?? null;
            $salaId          = $input['sala_id'] ?? null;
            $profissionalId  = $input['profissional_id'] ?? null;

            // buscamos o atendimento
            $atendimento = $this->Atendimento_model->getById($atendimentoId);

            if (! $atendimento) {
                throw new Exception('Atendimento inválido');
            }

            // buscamos a sala
            $sala = $this->Sala_model->getById($salaId);

            if (! $sala) {
                throw new Exception('Sala inválida');
            }

            // buscamos o profissional
            $profissional = $this->ion_auth->user($profissionalId)->row();

            if (! $profissional) {
                throw new Exception('Profissional inválido');
            }


            $this->Atendimento_model->update($atendimentoId, [
                'data_chamada'    => date('Y-m-d H:i:s'),
                'profissional_id' => (int) $profissional->id,
                'status'          => 'chamando',
                'sala_id'         => (int) $sala->id
            ]);

            //! temos que dispara o Pusher aqui para enviar para o painel

            return respond(statusCode: 200, message: 'Sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }

    /**
     * PUT /api/atendimentos/iniciar
     * 
     * Executado quando o atendente clica em "Iniciar atendimento"
     */
    public function iniciar()
    {
        try {

            $input = get_json_input();

            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $atendimentoId   = $input['atendimento_id'] ?? null;

            // buscamos o atendimento
            $atendimento = $this->Atendimento_model->getById($atendimentoId);

            if (! $atendimento) {
                throw new Exception('Atendimento inválido');
            }


            $this->Atendimento_model->update($atendimentoId, [
                'data_atendimento' => date('Y-m-d H:i:s'),
                'status'           => 'atendendo',
            ]);

            //! temos que dispara o Pusher aqui para enviar para o painel

            return respond(statusCode: 200, message: 'Sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }


    /**
     * PUT /api/atendimentos/finalizar
     * 
     * Executado quando o atendente clica em "Finalizar atendimento"
     */
    public function finalizar()
    {
        try {

            $input = get_json_input();

            if (!$input) {
                throw new Exception('Dados inválidos');
            }

            $atendimentoId   = $input['atendimento_id'] ?? null;

            // buscamos o atendimento
            $atendimento = $this->Atendimento_model->getById($atendimentoId);

            if (! $atendimento) {
                throw new Exception('Atendimento inválido');
            }


            $this->Atendimento_model->update($atendimentoId, [
                'data_finalizacao' => date('Y-m-d H:i:s'),
                'status'           => 'finalizado',
            ]);

            //! temos que dispara o Pusher aqui para enviar para o painel

            return respond(statusCode: 200, message: 'Sucesso');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
