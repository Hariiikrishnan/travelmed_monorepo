const fs = require('fs');
const path = require('path');

function replaceAPI(dir) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    for(const f of files) {
        if(f.isDirectory() && f.name !== 'node_modules' && f.name !== '.next') {
            replaceAPI(path.join(dir, f.name));
        } else if (f.isFile() && (f.name.endsWith('.tsx') || f.name.endsWith('.ts'))) {
            const p = path.join(dir, f.name);
            let content = fs.readFileSync(p, 'utf8');
            if (content.includes('http://localhost:5000')) {
                // If it's already inside template literal `` `http://localhost:5000/api` ``
                // We first replace `http://localhost:5000 with ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
                // Then we fix single quotes to backticks for simple fetch calls
                
                content = content.replace(/http:\/\/localhost:5000/g, "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");
                
                // Now find any single quoted strings that contain the newly replaced variable and turn them to backticks
                // Note: handling ' \${...}/... '
                content = content.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000'}([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:5000\'}$1`');
                
                fs.writeFileSync(p, content, 'utf8');
                console.log('Updated: ' + p);
            }
        }
    }
}
replaceAPI('d:/Travel_Med/travelmed-admin/src');
replaceAPI('d:/Travel_Med/travelmed-website/src');
