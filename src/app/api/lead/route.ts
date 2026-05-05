import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real scenario, you might send this to a database, Slack, or email.
    // For the generated app, we'll log it and return success.
    console.log('[LEAD CAPTURE]:', body);

    return NextResponse.json({ 
      success: true, 
      message: 'Lead captured successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to capture lead' 
    }, { status: 500 });
  }
}
