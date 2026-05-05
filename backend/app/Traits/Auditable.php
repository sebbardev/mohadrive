<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    /**
     * Record an audit log entry.
     */
    public function logAction(string $action, string $entity, $entityId, $details = null)
    {
        AuditLog::create([
            'action' => $action,
            'entity' => $entity,
            'entity_id' => (string) $entityId,
            'user_id' => Auth::id() ?? 'GUEST',
            'details' => $details,
        ]);
    }
}
