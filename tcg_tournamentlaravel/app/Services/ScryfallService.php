<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ScryfallService
{
    protected string $baseUrl = 'https://api.scryfall.com';

    public function buscarCarta(string $nombre): ?array
    {
        $response = Http::get("{$this->baseUrl}/cards/search", [
            'q' => $nombre
        ]);

        if ($response->successful()) {
            $data = $response->json();

            if (!empty($data['data'][0])) {
                $carta = $data['data'][0];
                return [
                    'scryfall_id' => $carta['id'],
                    'nombre' => $carta['name'],
                    'imagen_url' => $carta['image_uris']['normal'] ?? null
                ];
            }
        }

        return null;
    }
}
