export const config = {
  runtime: 'edge', // Tells Vercel to run this globally at the edge
};

export default async function handler(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const url = new URL(req.url);

  // 1. Check if the request is NOT from curl (e.g., Chrome, Safari)
  if (!userAgent.toLowerCase().includes('curl')) {
    // Redirect browsers to your GitHub repo
    return Response.redirect('https://github.com/your-username/your-repo', 302);
  }

  // 2. If it IS curl, fetch and serve the ASCII text file
  // Vercel hosts public files at the base domain origin
  const assetUrl = `${url.origin}/olly.txt`; 
  const fileResponse = await fetch(assetUrl);

  if (!fileResponse.ok) {
    return new Response('Olly text file not found.', { status: 404 });
  }

  // Stream the text file back to the terminal
  return new Response(fileResponse.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}