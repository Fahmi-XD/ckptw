const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        
        if (fs.lstatSync(srcFile).isDirectory()) {
            copyRecursiveSync(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

copyRecursiveSync('src/Interface/views', 'lib/Interface/views');
console.log('Html copied to views/');
copyRecursiveSync('src/Interface/static', 'lib/Interface/static');
console.log('Static copied to static/');
