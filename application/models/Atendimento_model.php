<?php

defined('BASEPATH') or exit('Ação não permitida!');

class Atendimento_model extends CI_Model
{
    protected $table = 'atendimentos';

    public function getAll()
    {
        return $this->db->order_by('data_entrada', 'DESC')->get($this->table)->result();
    }

    /**
     * Recupera os atendimentos mais recentes
     */
    public function latest(int $limit = 10)
    {
        return $this->db->order_by('data_entrada', 'DESC')
            ->limit($limit)
            ->get($this->table)
            ->where('status', 'chamando')
            ->result();
    }

    public function getById($id)
    {
        return $this->db->where('id', $id)->get($this->table)->row();
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
}
