<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Painel extends CI_Controller
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
     * GET /api/painel
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
     * GET /api/painel/aguardando
     * 
     * Recupera os atendimentos que já passaram pela triagem e estão aguardando definição de sala
     */
    public function aguardando()
    {
        try {
            $data = $this->Atendimento_model->triados();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/painel/chamados
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
     * GET /api/painel/ultima
     * 
     * Recupera o último atendimento que foi chamado
     */
    public function ultima()
    {
        try {

            $data = $this->Atendimento_model->ultimo();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }
}
