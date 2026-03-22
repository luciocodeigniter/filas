<?php

defined('BASEPATH') or exit('Ação não permitida!');

class Unidade_model extends CI_Model
{
    protected $table = 'unidades';

    public function getAll()
    {
        return $this->db->order_by('nome', 'ASC')->get($this->table)->result();
    }

    public function getById($id)
    {
        return $this->db->where('id', $id)->get($this->table)->row();
    }

    public function insert($data)
    {
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
}
