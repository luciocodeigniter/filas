<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pusher_lib
{
    protected $pusher;

    public function __construct()
    {
        $CI =& get_instance();
        $CI->config->load('pusher');

        $this->pusher = new Pusher\Pusher(
            $CI->config->item('key'),
            $CI->config->item('secret'),
            $CI->config->item('app_id'),
            [
                'cluster' => $CI->config->item('cluster'),
                'useTLS'  => true
            ]
        );
    }

    public function trigger($canal, $evento, $dados)
    {
        return $this->pusher->trigger($canal, $evento, $dados);
    }
}