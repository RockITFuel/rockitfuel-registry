import { type Action, type CustomResponse, useAction } from "@solidjs/router";
import debounce from "debounce";
import type { Accessor, JSX } from "solid-js";
import useLoading from "~/hooks/use-loading";

type NarrowResponse<T> =
  T extends CustomResponse<infer U> ? U : Exclude<T, Response>;

type Props<T extends any[], U> = {
  action: Action<T, U>;
  delayLoadingTime?: number;
  debounce?: number;
  convertDatesToUTC?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (e: NarrowResponse<U>) => void;
  children: (props: {
    isLoading: Accessor<boolean>;
    action: debounce.DebouncedFunction<
      (...args: Parameters<Action<T, U>>) => Promise<void>
    >;
  }) => JSX.Element;
};

// Utility function to convert a Date to UTC
function convertToUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

// Utility function to recursively convert Date objects to UTC
function convertDatesToUTC<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return convertToUTC(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToUTC(item)) as T;
  }

  if (typeof obj === "object") {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertDatesToUTC(value);
    }
    return converted;
  }

  return obj;
}

export default function ActionWrapper<T extends any[], U>(props: Props<T, U>) {
  const handleAction = useAction(props.action);
  const [isLoading, setIsLoading] = useLoading(props.delayLoadingTime);

  const action = async (...args: Parameters<Action<T, U>>) => {
    setIsLoading();
    try {
      // Convert all Date fields to UTC before passing to the action if enabled
      const convertedArgs = props.convertDatesToUTC
        ? (args.map((arg) => convertDatesToUTC(arg)) as Parameters<
            Action<T, U>
          >)
        : args;
      await handleAction(...convertedArgs).then((res) =>
        props.onSuccess?.(res)
      );
    } catch (error) {
      console.error("error: ", JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        props.onError?.(error);
      }
    }
    setIsLoading.cancel();
  };
  const debouncedAction = debounce(action, props.debounce ?? 300);

  return props.children({ isLoading, action: debouncedAction });
}
