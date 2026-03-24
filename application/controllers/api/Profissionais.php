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

            // 1. Busca usuários do grupo profissional
            $users = $this->ion_auth
                ->select('users.id, users.email, users.phone, users.first_name, users.last_name, users.active')
                ->users('profissional')
                ->result();

            if (!$users) {
                return respond(200, []);
            }

            $userIds = array_column($users, 'id');

            /**
             * 2. Buscar unidades em lote
             */
            $unidades = $this->db
                ->select('users_unidades.user_id, unidades.id, unidades.nome')
                ->from('users_unidades')
                ->join('unidades', 'unidades.id = users_unidades.unidade_id')
                ->where_in('users_unidades.user_id', $userIds)
                ->get()
                ->result();

            /**
             * 3. Buscar tipos em lote
             */
            $tipos = $this->db
                ->select('users_tipos_atendimento.user_id, tipos_atendimento.id, tipos_atendimento.nome')
                ->from('users_tipos_atendimento')
                ->join('tipos_atendimento', 'tipos_atendimento.id = users_tipos_atendimento.tipo_atendimento_id')
                ->where_in('users_tipos_atendimento.user_id', $userIds)
                ->get()
                ->result();

            /**
             * 4. Organizar (mapear por user_id)
             */
            $mapUnidades = [];
            foreach ($unidades as $u) {
                $mapUnidades[$u->user_id][] = $u;
            }

            $mapTipos = [];
            foreach ($tipos as $t) {
                $mapTipos[$t->user_id][] = $t;
            }

            /**
             * 5. Anexar aos usuários
             */
            foreach ($users as $key => $user) {
                $users[$key]->unidades = $mapUnidades[$user->id] ?? [];
                $users[$key]->tipos = $mapTipos[$user->id] ?? [];
            }

            return respond(200, $users);
        } catch (Exception $e) {
            return respond(500, null, $e->getMessage());
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


            // geramos o username com o nome e um hash
            $username = url_title($input['nome']) . '-' . substr(md5(time()), 0, 8);
            $password = $input['senha'];
            $email    = $input['email'];
            $phone    = empty($input['telefone']) ? null : $input['telefone'];
            $additional_data = array(
                'first_name' => $input['nome'],
                'last_name'  => $input['sobrenome'],
                'phone'      => $phone,
                'active'     => $input['ativo'] ? 1 : 0,
                'username'   => $username // mandamos o username para o ion_auth
            );

            // valida duplicidade ignorando o próprio ID
            $validation = $this->validate_unique_user_fields($email, $phone);

            if (! $validation['status']) {
                throw new Exception($validation['message']);
            }

            $group = array('3'); // Sets user to profissional group.

            // abrimos a transação
            $this->db->trans_begin();

            $user_id = $this->ion_auth->register($username, $password, $email, $additional_data, $group);

            // agora precisamos armazenar os tipo_atendimento_ids se tem algum dado
            $this->sync_tipos_atendimento($user_id, $input['tipo_atendimento_ids'] ?? []);

            // agora precisamos armazenar os unidade_ids se tem algum dado
            $this->sync_unidades($user_id, $input['unidade_ids'] ?? []);

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
     * Valida se os dados já existem
     *
     * @param string $email
     * @param string $phone
     * @param int|null $ignoreId
     * @return array
     */
    private function validate_unique_user_fields(string $email, string $phone, ?int $ignoreId = null): array
    {
        // valida email
        $this->db->from('users')->where('email', $email);

        if ($ignoreId) {
            $this->db->where('id !=', $ignoreId);
        }

        if ($this->db->count_all_results() > 0) {
            return ['status' => false, 'message' => 'E-mail já está em uso.'];
        }

        // valida telefone
        $this->db->from('users')->where('phone', $phone);

        if ($ignoreId) {
            $this->db->where('id !=', $ignoreId);
        }

        if ($this->db->count_all_results() > 0) {
            return ['status' => false, 'message' => 'Telefone já está em uso.'];
        }

        return ['status' => true];
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

            $password = empty($input['senha']) ? null : $input['senha'];
            $phone = empty($input['telefone']) ? null : $input['telefone'];

            // valida duplicidade ignorando o próprio ID
            $validation = $this->validate_unique_user_fields($input['email'], $phone, $id);

            if (! $validation['status']) {
                throw new Exception($validation['message']);
            }

            $data = array(
                'email'      => $input['email'],
                'first_name' => $input['nome'],
                'last_name'  => $input['sobrenome'],
                'phone'      => $phone,
                'active'     => $input['ativo'] ? 1 : 0,
            );

            if (! empty($password)) {
                $data['password'] = $password;
            }

            // abrimos a transação
            $this->db->trans_begin();

            // atualizamos
            $this->ion_auth->update($id, $data);

            // agora precisamos armazenar os tipo_atendimento_ids se tem algum dado
            $this->sync_tipos_atendimento($id, $input['tipo_atendimento_ids'] ?? []);

            // agora precisamos armazenar os unidade_ids se tem algum dado
            $this->sync_unidades($id, $input['unidade_ids'] ?? []);

            // se der tudo certo, commitamos a transação
            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
            } else {
                $this->db->trans_commit();
            }

            return respond(statusCode: 200, data: $id);
        } catch (\Throwable $e) {
            return respond(statusCode: 500, message: $e->getMessage());
        }
    }

    /**
     * DELETE /api/profissionais/delete/{id}
     */
    public function delete($id)
    {
        try {
            $this->ion_auth->delete_user($id);
            return respond(statusCode: 200, message: 'Sucesso!');
        } catch (\Throwable $th) {
            return respond(statusCode: 500, message: $th->getMessage());
        }
    }
}
