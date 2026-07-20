const fs = require('fs');
const path = require('path');

function replaceInFile(filepath, regex, replacement) {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(filepath, content);
}

replaceInFile('src/App.tsx', /import React, \{ Suspense/g, 'import { Suspense');
replaceInFile('src/components/layout/Footer.tsx', /import React from 'react';\n/g, '');
replaceInFile('src/components/layout/Navbar.tsx', /import React, \{ useState \} from 'react';/g, "import { useState } from 'react';");
replaceInFile('src/pages/Contact.tsx', /import React from 'react';\nimport \{ motion \} from 'framer-motion';/g, '');
replaceInFile('src/pages/FAQ.tsx', /import React, \{ useState \} from 'react';/g, "import { useState } from 'react';");
replaceInFile('src/pages/Features.tsx', /import React from 'react';\n/g, '');
replaceInFile('src/pages/Home.tsx', /import React from 'react';\n/g, '');
replaceInFile('src/pages/NotFound.tsx', /import React from 'react';\n/g, '');
replaceInFile('src/pages/ToolDetail.tsx', /CheckCircle, AlertCircle/g, 'CheckCircle');

replaceInFile('src/components/layout/Footer.tsx', /Instagram, Twitter, Github/g, 'Camera, Twitter, Github');
replaceInFile('src/components/layout/Navbar.tsx', /Menu, X, Instagram/g, 'Menu, X, Camera');
replaceInFile('src/components/layout/Footer.tsx', /<Instagram/g, '<Camera');
replaceInFile('src/components/layout/Navbar.tsx', /<Instagram/g, '<Camera');

console.log('Fixed TS errors.');
