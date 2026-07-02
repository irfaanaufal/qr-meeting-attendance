<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Signature extends Model
{
    protected $fillable = [
        'signable_type',
        'signable_id',
        'signature_path',
    ];

    public function signable(): MorphTo
    {
        return $this->morphTo();
    }
}
