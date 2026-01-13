import { cn } from "~/lib/utils";
import { Expandable } from "../helpers/expandable";

type SuperErrorProps = {
	name: string;
	error?: string;
	class?: string;
};

/**
 * Input error that tells the user what to do to fix the problem.
 */
export function SuperError(props: SuperErrorProps) {
	return (
		<Expandable expanded={!!props.error}>
			<div
				class={cn("mt-1 text-red-500 text-sm", props.class)}
				id={`${props.name}-error`}
			>
				{props.error}
			</div>
		</Expandable>
	);
}
