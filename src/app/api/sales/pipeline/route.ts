import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getPipelineBoard } from '@/lib/services/sales.service';

// GET /api/sales/pipeline
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'sales:deals:read');
    const board = await getPipelineBoard();
    return ok(board);
  } catch (error) {
    return handleRouteError(error);
  }
}
