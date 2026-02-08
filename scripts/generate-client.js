const { exec } = require('child_process');
const path = require('path');

// Change to project directory
process.chdir(path.join(__dirname, '..'));

console.log('Generating Prisma Client...');
console.log('Working directory:', process.cwd());

// Try to generate without connecting to DB
exec('npx prisma generate --no-engine', (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error.message);
        console.error('Stderr:', stderr);

        // Try without the flag
        console.log('\nRetrying without --no-engine flag...');
        exec('npx @prisma/client@latest generate', (error2, stdout2, stderr2) => {
            if (error2) {
                console.error('Error:', error2.message);
                console.error('Stderr:', stderr2);
            } else {
                console.log('Success!');
                console.log(stdout2);
            }
        });
    } else {
        console.log('Success!');
        console.log(stdout);
    }
});
