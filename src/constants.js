export const LANGUAGE_VERSIONS = {
  python: "3.12.5",
  java: "17.0.6", 
  c: "14.1.0",
  csharp: "6.6.0.161",
  javascript: "18.15.0",
  typescript: "5.0.3",
  php: "8.3.11",
  ruby: "2.7.0",
  rust: "1.85.0",
  go: "1.23.5",
  kotlin: "2.1.10",
  swift: "5.2.3",
  scala: "3.4.2",
};

export const JUDGE0_LANGUAGE_IDS = {
  python: 100, // 3.12.5
  java: 91,    // JDK 17.0.6
  c: 103,      // GCC 14.1.0
  csharp: 51,  // Mono 6.6.0.161
  javascript: 93, // Node.js 18.15.0
  typescript: 94, // TypeScript 5.0.3
  php: 98,     // PHP 8.3.11
  ruby: 72,    // Ruby 2.7.0
  rust: 108,   // Rust 1.85.0
  go: 107,     // Go 1.23.5
  kotlin: 111, // Kotlin 2.1.10
  swift: 83,   // Swift 5.2.3
  scala: 112,  // Scala 3.4.2
};

export const CODE_SNIPPETS = {
  python: `# Write your code here\n`,
  java: `public class Main {\n\tpublic static void main(String[] args) {\n\t\t// Write your code here\n\t}\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n\t// Write your code here\n\treturn 0;\n}\n`,
  csharp: `using System;\n\nnamespace Solution\n{\n\tclass Program {\n\t\tstatic void Main(string[] args) {\n\t\t\t// Write your code here\n\t\t}\n\t}\n}\n`,
  javascript: `// Write your code here\n`,
  typescript: `// Write your code here\n`, 
  php: `<?php\n\n// Write your code here\n`,
  ruby: `# Write your code here\n`,
  rust: `fn main() {\n\t// Write your code here\n}\n`,
  go: `package main\n\nfunc main() {\n\t// Write your code here\n}\n`,
  kotlin: `fun main() {\n\t// Write your code here\n}\n`,
  swift: `// Write your code here\n`,
  scala: `object Main extends App {\n\t// Write your code here\n}\n`,
};
