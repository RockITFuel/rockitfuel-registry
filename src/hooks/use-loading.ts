import { createSignal } from "solid-js";

/**
 * Custom hook to manage a loading state with a delay.
 *
 * @param {number} delayTime - The delay time in milliseconds before setting the loading state. Default is 300ms.
 */
export default function useLoading(delayTime = 300) {
	const [isLoading, setSignal] = createSignal(false);
	let timeout: NodeJS.Timeout | undefined;

	/**
	 * Sets the loading state to true after the specified delay time.
	 */
	const setIsLoading = () => {
		clearTimeout(timeout);
		// Set a new timeout to delay the execution of setSignal
		timeout = setTimeout(() => {
			// After the delay time, set the isLoading signal to the provided value
			setSignal(true);
		}, delayTime);
	};

	/**
	 * Cancels the loading state and clears the timeout.
	 */
	setIsLoading.cancel = () => {
		setSignal(false);
		clearTimeout(timeout);
	};

	return [isLoading, setIsLoading] as const;
}
