"use client";

import { Index as registry } from "@/__registry__";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants/app";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

const packageManagers = [
	{ name: "npm", command: "npx" },
	{ name: "yarn", command: "npx" },
	{ name: "pnpm", command: "pnpm dlx" },
	{ name: "bun", command: "bunx --bun" },
];

export function ComponentInstall({ name }: { name: keyof typeof registry }) {
	const component = registry[name];
	const [copied, setCopied] = useState(false);
	const componentURL = `${APP_URL}/r/${component.name}.json`;

	const copyCommand = (packageManager: string) => {
		const command = `${packageManager} shadcn@latest add ${componentURL}`;
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<CodeBlock lang="tsx" allowCopy={false}>
			<Pre>npx shadcn@latest add {componentURL}</Pre>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="absolute right-2 top-1/2 -translate-y-1/2"
						size="sm"
						title="Copy install command"
					>
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{packageManagers.map((pm) => (
						<DropdownMenuItem
							key={pm.name}
							onSelect={() => copyCommand(pm.command)}
						>
							{pm.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</CodeBlock>
	);
}
