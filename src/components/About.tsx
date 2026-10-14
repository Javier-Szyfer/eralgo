import { useEffect, useRef, useState } from "react";

interface AboutProps {
	/** Also open on hover, with the popover to the right (desktop) instead of below */
	hover?: boolean;
}

export default function About({ hover = false }: AboutProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handleClick = (e: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("touchstart", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("touchstart", handleClick);
		};
	}, [open]);

	return (
		<div ref={ref} className="group relative flex items-center gap-2">
			<p className="text-xs text-mac-text-muted">eralgo</p>
			<button
				type="button"
				aria-label="About eralgo"
				aria-expanded={open}
				onClick={() => setOpen(!open)}
				className="flex h-4 w-4 items-center justify-center rounded-full border border-white/50 bg-white/10 text-[8px] text-mac-text-muted backdrop-blur-2xl transition-colors hover:bg-white/20"
			>
				?
			</button>
			<div
				className={`absolute z-20 animate-fade-in-fast rounded-xl border border-white/50 bg-white/10 p-3 opacity-0 backdrop-blur-2xl ${
					open ? "block" : hover ? "hidden group-hover:block" : "hidden"
				} ${
					hover
						? "top-0 left-full ml-2 w-[200px]"
						: "top-full left-0 mt-2 max-w-[250px]"
				}`}
			>
				<p className="text-[10px] text-mac-text-muted leading-relaxed">
					eralgo is an independent electronic producer based in Buenos Aires,
					Argentina
				</p>
			</div>
		</div>
	);
}
