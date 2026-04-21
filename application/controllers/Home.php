<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Home extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();

		if (!$this->ion_auth->logged_in()) {
			redirect('login');
		}
	}

	public function index()
	{
		$data['title'] = 'Home';
		$data['content'] = $this->load->view('home/index', NULL, TRUE);

		// $this->send_notification();

		$this->load->view('layouts/main', $data);
	}

	public function send_notification()
	{
		$this->config->load('pusher');

		$options = array(
			'cluster' => $this->config->item('cluster'),
			'useTLS' => true
		);

		$pusher = new Pusher\Pusher(
			$this->config->item('key'),
			$this->config->item('secret'),
			$this->config->item('app_id'),
			$options
		);

		$data['message'] = 'Hello from CodeIgniter 3!';
		$pusher->trigger('my-channel', 'my-event', $data);
	}
}
