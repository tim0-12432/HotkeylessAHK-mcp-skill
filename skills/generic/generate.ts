import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

type Harness = {
    name: string;
    skillsPath: string;
    headers: {
        discover: string;
        invoke: string;
    };
}

const HarnessClaude = {
    name: 'Claude',
    skillsPath: '../.claude/skills',
    headers: {
        discover: `---
name: hotkeyless-ahk-discover
description: Discover available AutoHotkey commands from the Hotkeyless AHK server.
---`,
        invoke: `---
name: hotkeyless-ahk-invoke
description: Invoke a specific AutoHotkey command on the Hotkeyless AHK server.
---`,
    },
}

const HarnessOpenCode = {
    name: 'OpenCode',
    skillsPath: '../.opencode/skills',
    headers: {
        discover: `---
name: hotkeyless-ahk-discover
description: Discover available AutoHotkey commands from the Hotkeyless AHK server.
---`,
        invoke: `---
name: hotkeyless-ahk-invoke
description: Invoke a specific AutoHotkey command on the Hotkeyless AHK server.
---`,
    },
}

const Harnesses: Harness[] = [HarnessClaude, HarnessOpenCode];

const skills: string[] = ["discover", "invoke"];

for (const skill of skills) {
    const readPath = `./${skill}.md`;
    const readContent = readFileSync(readPath, "utf-8");

    for (const harness of Harnesses) {
        const content = `${harness.headers[skill as keyof typeof harness.headers]}\n\n${readContent}\n`;
        const filePath = `${harness.skillsPath}/hotkeyless-ahk-${skill}/SKILL.md`;
        mkdirSync(`${harness.skillsPath}/hotkeyless-ahk-${skill}`, { recursive: true });
        writeFileSync(filePath, content);
        console.log(`Generated skill file: ${filePath}`);
    }
}
