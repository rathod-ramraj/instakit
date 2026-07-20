const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
content = content.replace(/import \{ Camera, Twitter, Github \} from 'lucide-react';/, "import { Camera } from 'lucide-react';\nimport { FaTwitter, FaGithub } from 'react-icons/fa';");
content = content.replace(/<Twitter/g, '<FaTwitter');
content = content.replace(/<Github/g, '<FaGithub');
fs.writeFileSync('src/components/layout/Footer.tsx', content);

let toolDetail = fs.readFileSync('src/pages/ToolDetail.tsx', 'utf8');
toolDetail = toolDetail.replace(/import React, \{ useState \} from 'react';/g, "import { useState } from 'react';");
fs.writeFileSync('src/pages/ToolDetail.tsx', toolDetail);

let hashtagGen = fs.readFileSync('src/pages/HashtagGenerator.tsx', 'utf8');
hashtagGen = hashtagGen.replace(/import React, \{ useState \} from 'react';/g, "import { useState } from 'react';");
fs.writeFileSync('src/pages/HashtagGenerator.tsx', hashtagGen);
