import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '15'; // Force 15 par défaut
    const car_id = searchParams.get('car_id');
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const sort_by = searchParams.get('sort_by') || 'date';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const search = searchParams.get('search');

    // Construire l'URL vers le backend Laravel avec pagination forcée à 15
    const backendUrl = new URL("https://mohadrive.com/api/expenses");
    backendUrl.searchParams.set('page', page);
    backendUrl.searchParams.set('per_page', per_page); // Forcer 15
    
    if (car_id) backendUrl.searchParams.set('car_id', car_id);
    if (type) backendUrl.searchParams.set('type', type);
    if (from) backendUrl.searchParams.set('from', from);
    if (to) backendUrl.searchParams.set('to', to);
    if (sort_by) backendUrl.searchParams.set('sort_by', sort_by);
    if (sort_order) backendUrl.searchParams.set('sort_order', sort_order);
    if (search) backendUrl.searchParams.set('search', search);

    // Récupérer les headers de la requête originale
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    
    // Transférer l'authorization header s'il existe
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }

    // Faire la requête vers le backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Récupérer les données du backend
    const raw = await response.json();

    // Normaliser : le backend peut retourner soit un tableau plat, soit {data: [...], total: ...}
    const allItems: any[] = Array.isArray(raw) ? raw : (raw.data && Array.isArray(raw.data) ? raw.data : []);

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);
    const total = allItems.length;
    const last_page = Math.max(1, Math.ceil(total / perPageNum));
    const startIndex = (pageNum - 1) * perPageNum;
    const endIndex = startIndex + perPageNum;
    const paginatedData = allItems.slice(startIndex, endIndex);
    const fromIndex = total > 0 ? startIndex + 1 : 0;
    const toIndex = Math.min(endIndex, total);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        current_page: pageNum,
        last_page,
        total,
        from: fromIndex,
        to: toIndex,
        per_page: perPageNum,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in expenses API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
