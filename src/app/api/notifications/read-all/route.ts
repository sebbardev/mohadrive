import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    // Construire l'URL vers le backend Laravel
    const backendUrl = `https://mohadrive.com/api/notifications/read-all`;

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
      method: 'PUT',
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
    console.error('Error in notifications read-all API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
