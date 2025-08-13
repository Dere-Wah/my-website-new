import { cn } from "@/lib/utils";
import React from "react";

interface CalloutProps {
	emoji?: string;
	children: React.ReactNode;
	className?: string;
}

export function Callout({ emoji = "💡", children, className }: CalloutProps) {
	return (
		<div
			className={cn(
				"my-6 rounded-md bg-gray-400/20 p-3 text-sm",
				className
			)}
		>
			<div className="grid grid-cols-[1.5em,1fr] items-start gap-x-3">
				<div className="col-[1] row-[1] select-none text-base leading-[1.25]">
					{emoji}
				</div>
				<div className="col-[2] row-[1] prose-sm prose dark:prose-invert m-0 max-w-none prose-p:my-3 prose-ul:my-3 prose-ol:my-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
					{children}
				</div>
			</div>
		</div>
	);
}
