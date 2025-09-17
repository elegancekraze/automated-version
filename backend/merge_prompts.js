import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Read the files
const original70 = JSON.parse(fs.readFileSync('f:/ischatgptfree/data/gpt5_prompts_full.json', 'utf8'));
const backup500 = JSON.parse(fs.readFileSync('f:/ischatgptfree/data/gpt5_prompts_full_backup.json', 'utf8'));

console.log(`Original 70 prompts: ${original70.length}`);
console.log(`Backup 500 prompts: ${backup500.length}`);

// Create a map to deduplicate by title (case-insensitive)
const uniquePrompts = new Map();

// Add backup prompts first (they have better UUIDs)
backup500.forEach((prompt, index) => {
    const titleKey = prompt.title.toLowerCase().trim();
    if (!uniquePrompts.has(titleKey)) {
        uniquePrompts.set(titleKey, prompt);
    } else {
        console.log(`Duplicate found in backup[${index}]: ${prompt.title}`);
    }
});

console.log(`After backup processing: ${uniquePrompts.size} unique prompts`);

// Add original prompts that are missing from backup
let addedFromOriginal = 0;
original70.forEach((prompt, index) => {
    const titleKey = prompt.title.toLowerCase().trim();
    if (!uniquePrompts.has(titleKey)) {
        // Convert to UUID format to match backup structure
        const newPrompt = {
            ...prompt,
            id: uuidv4() // Generate new UUID for consistency
        };
        uniquePrompts.set(titleKey, newPrompt);
        addedFromOriginal++;
        console.log(`Added from original[${index}]: ${prompt.title}`);
    }
});

console.log(`Added from original: ${addedFromOriginal}`);

const mergedPrompts = Array.from(uniquePrompts.values());

console.log(`Merged unique prompts: ${mergedPrompts.length}`);

// Save the merged result
fs.writeFileSync(
    'f:/ischatgptfree/automated-version/backend/data/prompts.json',
    JSON.stringify(mergedPrompts, null, 2)
);

console.log('✅ Merged and deduplicated prompts saved!');
console.log(`Total unique prompts: ${mergedPrompts.length}`);