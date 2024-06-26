import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('static/textos.json');

export const GET = async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const textos = JSON.parse(data);
    return json(textos);
  } catch (error) {
    return json({ error: 'Failed to read file' }, { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const newTextos = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(newTextos, null, 2));
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to write file' }, { status: 500 });
  }
};
