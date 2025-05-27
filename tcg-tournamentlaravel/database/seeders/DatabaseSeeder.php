<?php

namespace Database\Seeders;

use App\Models\Usuario;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Usuario::factory()->create([
            'nombre' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('12345678'),
            'rol' => 'admin',
            'telefono' => '666666666',
            'dni' => '12345678A'
        ]);
    }
}
