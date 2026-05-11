import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '15';
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const filter = searchParams.get('filter') || 'ALL';

    // Construire l'URL vers le backend Laravel
    const backendUrl = `https://mohadrive.com/api/notifications?page=${page}&per_page=${per_page}&sort_by=${sort_by}&sort_order=${sort_order}&filter=${filter}`;

    // Récupérer les headers de la requête originale
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    
    // Transférer l'authorization header s'il existe
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }

    // Faire la requête vers le backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });

    // Transférer la réponse
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in notifications API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
