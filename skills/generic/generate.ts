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
description: Discover available automation commands on the user's Windows machine via the Hotkeyless AHK HTTP server. Use when the user asks what desktop automation, hotkeys, or AHK commands are available, or before invoking any Hotkeyless AHK command for the first time.
---`,
        invoke: `---
name: hotkeyless-ahk-invoke
description: Invoke desktop automation commands on the user's Windows machine via the Hotkeyless AHK HTTP server. Use when the user asks to open programs, press hotkeys, move the mouse, control media, or perform any desktop action. Requires discovering commands first using the hotkeyless-ahk-discovering skill.
---`,
    },
}

const HarnessOpenCode = {
    name: 'OpenCode',
    skillsPath: '../.opencode/skills',
    headers: {
        discover: `---
name: hotkeyless-ahk-discover
description: Discover available automation commands on the user's Windows machine via the Hotkeyless AHK HTTP server. Use when the user asks what desktop automation, hotkeys, or AHK commands are available, or before invoking any Hotkeyless AHK command for the first time.
---`,
        invoke: `---
name: hotkeyless-ahk-invoke
description: Invoke desktop automation commands on the user's Windows machine via the Hotkeyless AHK HTTP server. Use when the user asks to open programs, press hotkeys, move the mouse, control media, or perform any desktop action. Requires discovering commands first using the hotkeyless-ahk-discovering skill.
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
