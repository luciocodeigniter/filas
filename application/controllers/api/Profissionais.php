<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Profissionais extends CI_Controller
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
    }

    /**
     * GET /api/profissionais
     */
    public function index()
    {
        try {
            $data = $this->ion_auth->users('profissional')->result(); // get users from 'profissional' group
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * GET /api/profissionais/{id}
     */
    public function show($id)
    {
        try {
            $data = $this->ion_auth->user($id)->row();
            return respond(statusCode: 200, data: $data);
        } catch (Exception $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * POST /api/profissionais/create
     */
    public function create()
    {
        try {
            $input = get_json_input();


            // <pre>Array
            // (
            //     [nome] => Lucio (first_name)
            //     [telefone] => (41) 98456-4654 (phone)
            //     [email] => lucio@email.com
            //     [perfil_acesso] => Super Admin (será profissional)
            //     [senha] => teste123456 (password)
            //     [unidade_ids] => Array
            //         (
            //             [0] => 4
            //         )

            //     [tipo_atendimento_ids] => Array
            //         (
            //             [0] => 2
            //         )

            //     [ativo] => 1 (active)
            // )

            // geramos o username com o nome e um hash
            $username = url_title($input['nome']) . '-' . substr(md5(time()), 0, 8);
            $password = $input['senha'];
            $email    = $input['email'];
            $additional_data = array(
                'first_name' => $input['nome'],
                'last_name'  => $input['sobrenome'],
                'phone'      => $input['telefone'],
                'active'     => $input['ativo'] ? 1 : 0,
                'username'   => $username // mandamos o username para o ion_auth
            );

            $group = array('3'); // Sets user to profissional group.

            // abrimos a transação
            $this->db->trans_begin();

            $user_id = $this->ion_auth->register($username, $password, $email, $additional_data, $group);

            // agora precisamos armazenar os tipo_atendimento_ids se tem algum dado
            if (!empty($input['tipo_atendimento_ids'])) {
                $this->sync_tipos_atendimento($user_id, $input['tipo_atendimento_ids']);
            }

            // agora precisamos armazenar os unidade_ids se tem algum dado
            if (!empty($input['unidade_ids'])) {
                $this->sync_unidades($user_id, $input['unidade_ids']);
            }

            // se der tudo certo, commitamos a transação
            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
            } else {
                $this->db->trans_commit();
            }

            return respond(statusCode: 201, data: $user_id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * Realiza a sincronização dos tipos de atendimento do profissional
     */
    private function sync_tipos_atendimento($profissional_id, $tipos_atendimento_ids)
    {
        $table = 'users_tipos_atendimento';

        // remove todos os tipos de atendimento do profissional
        $this->db->where('user_id', $profissional_id);
        $this->db->delete($table);

        // agora insere novamente
        if (!empty($tipos_atendimento_ids)) {
            foreach ($tipos_atendimento_ids as $tipo_atendimento_id) {
                $this->db->insert($table, [
                    'user_id'             => $profissional_id,
                    'tipo_atendimento_id' => $tipo_atendimento_id
                ]);
            }
        }
    }

    /**
     * Realiza a sincronização das unidades do profissional
     */
    private function sync_unidades($profissional_id, $unidades_ids)
    {
        $table = 'users_unidades';

        // remove todas as unidades do profissional
        $this->db->where('user_id', $profissional_id);
        $this->db->delete($table);

        // agora insere novamente
        if (!empty($unidades_ids)) {
            foreach ($unidades_ids as $unidade_id) {
                $this->db->insert($table, [
                    'user_id'    => $profissional_id,
                    'unidade_id' => $unidade_id
                ]);
            }
        }
    }

    /**
     * PUT /api/profissionais/update/{id}
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
     * DELETE /api/profissionais/delete/{id}
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
