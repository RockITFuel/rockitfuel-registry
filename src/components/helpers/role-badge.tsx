import type { Component } from "solid-js";
import { Badge } from "~/components/ui/badge";

export type RoleBadgeProps = {
	role: "care_taker" | "team_lead" | "planner" | "admin" | "read_only";
};

const roleConfig = {
	care_taker: {
		label: "Hulpverlener",
		colorClass: "bg-orange-600 hover:bg-orange-700",
	},
	team_lead: {
		label: "Teamlead",
		colorClass: "bg-orange-600 hover:bg-orange-700",
	},
	planner: {
		label: "Planner",
		colorClass: "bg-orange-600 hover:bg-orange-700",
	},
	admin: {
		label: "Beheerder",
		colorClass: "bg-slate-500 hover:bg-slate-600",
	},
	read_only: {
		label: "Management",
		colorClass: "bg-slate-500 hover:bg-slate-600",
	},
};

const RoleBadge: Component<RoleBadgeProps> = (props) => {
	const config = () => roleConfig[props.role];

	return (
		<Badge round variant="default" class={`${config().colorClass} text-white`}>
			{config().label}
		</Badge>
	);
};

export default RoleBadge;
