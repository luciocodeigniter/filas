<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Administrativo extends CI_Controller
{
	public function index()
	{
		$data['title'] = 'Administrativo';
		$data['content'] = $this->load->view('administrativo/index', NULL, TRUE);
		$this->load->view('layouts/administrativo', $data);
	}
}
