
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("Checking Environment Variables...");
const keys = Object.keys(process.env).filter(k =>
    k.includes('GOOGLE') || k.includes('GEMINI') || k.includes('API') || k.includes('KEY')
);

keys.forEach(k => {
    const Val = process.env[k];
    console.log(`${k}: ${Val ? (Val.length > 5 ? 'EXISTS (Length: ' + Val.length + ')' : 'SHORT_VALUE') : 'EMPTY'}`);
});

if (keys.length === 0) {
    console.log("No relevant API keys found.");
}
