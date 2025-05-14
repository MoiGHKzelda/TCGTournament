<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://tcg_tournamentlaravel.test:5173'],

    'allowed_headers' => ['*'],

    'supports_credentials' => false,

];
