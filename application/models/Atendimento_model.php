<?php

defined('BASEPATH') or exit('Ação não permitida!');

class Atendimento_model extends CI_Model
{
    protected $table = 'atendimentos';

    public function getAll()
    {
        // fazemos o join com a tabela de classificacoes
        // e salas
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        $this->db->order_by('data_entrada', 'ASC');
        return $this->db
            ->get($this->table)
            ->result();
    }

    /**
     * Recupera os atendimentos que já passaram pela triagem e que ainda não foram chamados.
     * Ou seja, estão aguardando definição de sala
     */
    public function triados(int $limit = 10)
    {
        // fazemos o join com a tabela de classificacoes
        // e salas
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        $this->db->order_by('data_entrada', 'ASC');
        $this->db->limit($limit);
        return $this->db
            ->where('status', 'triado') // aguardando
            ->where('classificacao_risco_id !=', null) // já classificado
            ->where('sala_id', null) // sem sala
            ->get($this->table)
            ->result();
    }

    /**
     * Recupera os atendimentos que já foram chamados
     */
    public function chamados(int $limit = 10)
    {
        // fazemos o join com a tabela de classificacoes
        // e salas
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        $this->db->order_by('data_entrada', 'ASC');
        $this->db->limit($limit);
        return $this->db
            ->get($this->table)
            ->result();
    }

    /**
     * Recupera os atendimentos que estão aguardando triagem
     */
    public function aguardando(int $limit = 10)
    {
        // fazemos o join com a tabela de classificacoes
        // e salas
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        return $this->db->order_by('data_entrada', 'ASC')
            ->limit($limit)
            ->where('status', 'aguardando') //! aguardando triagem
            ->get($this->table)
            ->result();
    }

    /**
     * Recupera os atendimentos mais recentes que já foram chamados
     */
    public function latest(int $limit = 5)
    {
        // fazemos o join com a tabela de classificacoes
        // e salas
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        return $this->db->order_by('data_entrada', 'ASC')
            ->limit($limit)
            ->where('status', 'chamando') //! que foram chamados
            ->get($this->table)
            ->result();
    }

    public function getById($id)
    {
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        return $this->db->where('atendimentos.id', $id)->get($this->table)->row();
    }

    public function getByIdAsArray($id)
    {
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');
        return $this->db->where('atendimentos.id', $id)->get($this->table)->row_array();
    }

    public function insert($data)
    {
        $data['numero_senha'] = $this->generate_senha();
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data)
    {
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function delete($id)
    {
        return $this->db->where('id', $id)->delete($this->table);
    }

    public function generate_senha()
    {
        $this->db->trans_start();

        // trava a tabela (evita concorrência)
        $this->db->query('LOCK TABLES atendimentos WRITE');

        $ultima = $this->db
            ->select('numero_senha')
            ->from('atendimentos')
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get()
            ->row();

        if (!$ultima || empty($ultima->numero_senha)) {
            $novaSenha = 'S001';
        } else {
            $numero = (int) preg_replace('/[^0-9]/', '', $ultima->numero_senha);
            $novaSenha = 'S' . str_pad($numero + 1, 3, '0', STR_PAD_LEFT);
        }

        // libera tabela
        $this->db->query('UNLOCK TABLES');

        $this->db->trans_complete();

        return $novaSenha;
    }

    /**
     * Recupera último atendimento chamado na data de hoje
     */
    public function ultimo()
    {
        $this->db->select([
            'atendimentos.*',
            'classificacoes_risco.nome as classificacao_nome',
            'classificacoes_risco.cor as classificacao_cor',
            'salas.nome as sala_nome',
            'tipos_atendimento.nome as tipo_atendimento_nome'
        ]);

        $this->db->join('classificacoes_risco', 'classificacoes_risco.id = atendimentos.classificacao_risco_id', 'left');
        $this->db->join('salas', 'salas.id = atendimentos.sala_id', 'left');
        $this->db->join('tipos_atendimento', 'tipos_atendimento.id = atendimentos.tipo_atendimento_id', 'left');

        return $this->db
            ->where('status', 'chamando') // apenas os que foram chamados
            ->order_by('data_chamada', 'DESC') // mais recente primeiro
            ->limit(1)
            ->get($this->table)
            ->row_array() ?? [];
    }
}
